import sqlite, { Database } from 'better-sqlite3'
import { Song, Album } from '@data/music-data'
import queue from 'async/queue'
import { QueueObject } from 'async'
import {
    AlbumArtistModel,
    AlbumGenreModel,
    AlbumModel,
    SongArtistModel,
    SongGenreModel,
    SongModel,
} from '@data/music-model'
import { IntLike } from 'integer'

/** Task data for album insert queue */
interface AlbumInsertQueueTask {
    album: Album
}

/**
 * Component encapsulating the central application database.
 *
 * TODO: Split into different components/DAOs?
 * TODO: Song add query can probably be optimized
 *       (using 1 fetch instead of 2?)
 * TODO: Look into secondary indices
 * TODO: projections for GET
 * TODO: split table querying into separate DAOs? (e.g. one for song, one for album)
 */
class AppDatabase {
    db: Database

    /**
     * Async queue for album inserts.
     * The queue must be initialized with concurrency 1 in order to
     * avoid inserting the same album over a short period of time.
     *
     * TODO: Can probably be optimized further, e.g. in batch processing
     * TODO: Queueing is only needed for the same AlbumData objects. Can maybe use
     *       Map<AlbumData, Queue>
     * TODO: Re-evaluate if queue necessary with better-sqlite3 (one test with concurrency 100 did not indicate so)
     */
    albumInsertQueue: QueueObject<AlbumInsertQueueTask>

    constructor(dbFilePath: string) {
        this.db = sqlite(dbFilePath, { verbose: console.log })
        this.albumInsertQueue = new queue(this.processAlbum, 1)
        this.initializeTables()
    }

    /**
     * Processes an AlbumInsertQueueTask. Used as the processing function
     * for the Album Insert Queue.
     *
     * @param task Task to process
     * @param callback Callback function that is invoked at end of processing (parameter)
     */
    processAlbum = (
        task: AlbumInsertQueueTask,
        callback: (album: Album) => void
    ): void => {
        const album = this.getOrAddAlbum(task.album)
        callback(album)
    }

    /**
     * Fetches an album, or adds if the album does not exist in the database.
     *
     * NOTE: The function should be ran synchronously for the same albums to avoid
     *       conflicts and race conditions!
     *
     * See also: addAlbum and getAlbum
     *
     * @param album Album to add
     */
    getOrAddAlbum(album: Album): Album {
        let albumEntry: Album = this.getAlbum(album)

        if (!albumEntry) {
            const id = this.addAlbum(album)
            albumEntry = this.getAlbum(album.setId(id))
        }

        return albumEntry
    }

    /**
     * Fetches album from given album data instance.
     * If such entry does not exist, 'undefined' will be returned.
     *
     * Album is fetched on basis of title and artists,
     * or directly by ID if it is present.
     *
     * TODO: When artists.length > 1, all artists should be matched
     *       (or longest match alternatively)
     *
     * @param album Album data to fetch album database entry with
     */
    getAlbum(album: Album): Album | null {
        let albumRow: AlbumModel

        if (album.id) {
            albumRow = this.db
                .prepare('SELECT * FROM album WHERE id = ?')
                .get(album.id)
        } else {
            const titleCondition = album.title ? 'title = ?' : 'title iS NULL'

            // Generate query place holders for artists
            const artistInQueryPlaceholder = album.artists
                .map(() => {
                    return '?'
                })
                .join(', ')

            // No artists: fetch on basis of title; Else join with artist table and look for match
            const existingAlbumStmt =
                album.artists.length == 0
                    ? this.db.prepare(
                          `SELECT * FROM album WHERE ${titleCondition} LIMIT 1`
                      )
                    : this.db.prepare(
                          `
                        SELECT * FROM album JOIN album_artist ON album.id=album_artist.album_id
                        WHERE ${titleCondition} AND artist_name IN (${artistInQueryPlaceholder}) LIMIT 1
                        `
                      )

            const params = []
            if (album.title) {
                params.push(album.title)
            }

            for (const artist of album.artists) {
                params.push(artist)
            }

            albumRow = existingAlbumStmt.get(params)
        }

        if (!albumRow) {
            return null
        }

        const artists = this.db
            .prepare('SELECT artist_name FROM album_artist WHERE album_id=?')
            .all(albumRow.id)
            .map((row: AlbumArtistModel) => {
                return row.artist_name
            })

        const genres = this.db
            .prepare('SELECT genre FROM album_genre WHERE album_id=?')
            .all(albumRow.id)
            .map((row: AlbumGenreModel) => {
                return row.genre
            })

        const resultAlbum: Album = Album.create(albumRow)
            .setArtists(artists)
            .setGenres(genres)

        return resultAlbum
    }

    /**
     * Adds an album to the database from the provided AlbumData data object.
     * Returns the id of the album that was inserted.
     *
     * TODO: Handle updates (rather than 'IGNORE INTO') [for extra genres]
     *
     * @param album Album to add
     */
    addAlbum(album: Album): IntLike {
        // Update all genres
        album.genres.map((genre) => this.addGenre(genre))

        // Update all artists
        album.artists.map((artist) => this.addArtist(artist))

        const genreStmt = this.db.prepare(
            'INSERT OR IGNORE INTO album_genre VALUES (?, ?)'
        )
        const artistStmt = this.db.prepare(
            'INSERT OR IGNORE INTO album_artist VALUES (?, ?)'
        )

        const albumStmt = this.db
            .prepare('INSERT INTO album VALUES (NULL, ?, ?, ?, ?, ?)')
            .run(
                album.title,
                album.year,
                album.totalTracks,
                album.totalDisks,
                album.rating
            )

        const albumID = albumStmt.lastInsertRowid

        for (const genre of album.genres) {
            genreStmt.run(albumID, genre)
        }

        for (const artist of album.artists) {
            artistStmt.run(albumID, artist)
        }

        return albumID
    }

    /**
     * Adds a song to the database from the provided Song object.
     * The Song is linked to it's defined album, which is created if it does not exist.
     *
     * TODO: REPLACE INTO will create a new ID, which might cause problems later on.
     *       Should look into an alternative measure (maybe lookup then insert)
     *
     * @param song Song to add
     */
    addSong(song: Song): Promise<void> {
        return new Promise((resolve) => {
            // Run insert synchronously, then continue song addition in parallel
            this.albumInsertQueue.push(
                { album: song.album },
                async (album: Album) => {
                    // Update all genres
                    song.genres.map((genre) => this.addGenre(genre))

                    // Update all artists
                    song.artists.map((artist) => this.addArtist(artist))

                    const songStmt = this.db
                        .prepare(
                            'INSERT OR REPLACE INTO song VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)'
                        )
                        .run(
                            song.path,
                            song.title,
                            song.year,
                            song.track,
                            song.disk,
                            song.duration,
                            song.rating,
                            album.id
                        )

                    const songID = songStmt.lastInsertRowid

                    const genreStmt = this.db.prepare(
                        'INSERT OR IGNORE INTO song_genre VALUES (?, ?)'
                    )
                    const artistStmt = this.db.prepare(
                        'INSERT OR IGNORE INTO song_artist VALUES (?, ?)'
                    )

                    for (const genre of song.genres) {
                        genreStmt.run(songID, genre)
                    }

                    for (const artist of song.artists) {
                        artistStmt.run(songID, artist)
                    }

                    resolve()
                }
            )
        })
    }

    /**
     * Gets song data from the database, querying by path.
     *
     * TODO: replace parameter with 'Song' object?
     *
     * @param path Path of the song to retrieve
     */
    getSong(path: string): Song {
        const songRow: SongModel = this.db
            .prepare('SELECT * FROM song WHERE path = ?')
            .get(path)

        const genres = this.db
            .prepare('SELECT genre FROM song_genre WHERE song_id = ?')
            .all(songRow.id)
            .map((row: SongGenreModel) => {
                return row.genre
            })

        const artists = this.db
            .prepare('SELECT artist_name FROM song_artist WHERE song_id = ?')
            .all(songRow.id)
            .map((row: SongArtistModel) => {
                return row.artist_name
            })

        const album = this.getAlbum(new Album().setId(songRow.albumId))

        const resultSong: Song = Song.create(songRow)
            .setAlbum(album)
            .setArtists(artists)
            .setGenres(genres)

        return resultSong
    }

    /**
     * Retrieves all songs from the database.
     *
     * TODO: Add projections
     * TODO: Add filter conditions
     */
    getSongs(): Song[] {
        return this.db
            .prepare('SELECT path FROM song')
            .all()
            .map((songRow: SongModel) => {
                return Song.create(songRow)
            })
    }

    /**
     * Adds a genre to the database. If the genre already exists, does nothing.
     *
     * @param genre  Genre to add
     */
    addGenre(genre: string): void {
        this.db.prepare('INSERT OR IGNORE INTO genre VALUES(?)').run(genre)
    }

    /**
     * Adds an artist to the database. If the artist already exists, does nothing.
     * The function assumes that artist names are unique.
     *
     * TODO: Intention is to leave ambiguity resolution mostly to the user. However,
     * there might be a music database that could be utilized to check the artist ID.
     *
     * TODO: Keeping it simple for now by assuming artist name is unique (primary key)
     *
     * @param artist Artist to add
     */
    addArtist(artist: string): void {
        this.db.prepare('INSERT OR IGNORE INTO artist VALUES(?)').run(artist)
    }

    /**
     * Creates data tables.
     */
    initializeTables() {
        this.db.pragma('foreign_keys = ON')

        this.db.exec(`CREATE TABLE IF NOT EXISTS song(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE,
            title TEXT,
            year INTEGER,
            track INTEGER,
            disk INTEGER,
            duration FLOAT,
            rating INTEGER,
            albumId INTEGER,
            FOREIGN KEY(albumId) REFERENCES album(id)
        )`)

        this.db.exec(`CREATE TABLE IF NOT EXISTS album(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            year INTEGER,
            total_tracks INTEGER,
            total_disks INTEGER,
            rating INTEGER
        )`)

        this.db.exec(`CREATE TABLE IF NOT EXISTS genre(
            name TEXT PRIMARY KEY
        )`)

        this.db.exec(`CREATE TABLE IF NOT EXISTS artist(
            name TEXT PRIMARY KEY
        )`)

        this.db.exec(`CREATE TABLE IF NOT EXISTS song_genre(
            song_id INTEGER,
            genre TEXT,
            FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE,
            FOREIGN KEY(genre) REFERENCES genre(name) ON DELETE CASCADE,
            PRIMARY KEY(song_id, genre)
        )`)

        this.db.exec(`CREATE TABLE IF NOT EXISTS album_genre(
            album_id INTEGER,
            genre TEXT,
            FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE,
            FOREIGN KEY(genre) REFERENCES genre(name) ON DELETE CASCADE,
            PRIMARY KEY(album_id, genre)
        )`)

        this.db.exec(`CREATE TABLE IF NOT EXISTS song_artist(
            song_id INTEGER,
            artist_name TEXT,
            FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE,
            FOREIGN KEY(artist_name) REFERENCES artist(name) ON DELETE CASCADE,
            PRIMARY KEY(song_id, artist_name)
        )`)

        this.db.exec(`CREATE TABLE IF NOT EXISTS album_artist(
            album_id INTEGER,
            artist_name TEXT,
            FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE,
            FOREIGN KEY(artist_name) REFERENCES artist(name) ON DELETE CASCADE,
            PRIMARY KEY(album_id, artist_name)
        )`)
    }
}

// Create in-memory database
const appDB = new AppDatabase('test.db')

// Export app database singleton
export default appDB
