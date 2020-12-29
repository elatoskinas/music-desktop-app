import * as sqlite3 from 'sqlite3'
import { Song, Album } from '@data/music-data'
import queue from 'async/queue'
import { QueueObject } from 'async'
import { AlbumModel, SongModel } from '@data/music-model'

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
 * TODO: Make SongData and AlbumData function calls consistent
 *       (use either Album and Song OR AlbumData and SongData)
 * TODO: Wait for initialize tables to be completed (?)
 */
class AppDatabase {
    db: sqlite3.Database

    /**
     * Async queue for album inserts.
     * The queue must be initialized with concurrency 1 in order to
     * avoid inserting the same album over a short period of time.
     *
     * TODO: Can probably be optimized further, e.g. in batch processing
     * TODO: Queueing is only needed for the same AlbumData objects. Can maybe use
     *       Map<AlbumData, Queue>
     */
    albumInsertQueue: QueueObject<AlbumInsertQueueTask>

    constructor(dbFilePath: string) {
        this.db = new sqlite3.Database(dbFilePath)
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
    processAlbum = async (
        task: AlbumInsertQueueTask,
        callback: (album: AlbumModel) => void
    ): Promise<void> => {
        // Update all genres
        await Promise.all(
            task.album.genres.map((genre) => this.addGenre(genre))
        )

        // Update all artists
        await Promise.all(
            task.album.artists.map((artist) => this.addArtist(artist))
        )

        const album = await this.getOrAddAlbum(task.album)
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
    getOrAddAlbum(album: Album): Promise<AlbumModel> {
        return new Promise((resolve) => {
            this.db.serialize(async () => {
                let albumEntry: AlbumModel = await this.getAlbum(album)

                if (!albumEntry) {
                    await this.addAlbum(album)
                    albumEntry = await this.getAlbum(album)
                }

                resolve(albumEntry)
            })
        })
    }

    /**
     * Fetches album from given album data instance.
     * If such entry does not exist, 'undefined' will be returned.
     *
     * Album is fetched on basis of title and artists.
     *
     * TODO: When artists.length > 1, all artists should be matched
     *       (or longest match alternatively)
     *
     * @param album Album data to fetch album database entry with
     */
    getAlbum(album: Album): Promise<AlbumModel> {
        return new Promise((resolve) => {
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
                        `SELECT id FROM album WHERE ${titleCondition} LIMIT 1`
                    )
                    : this.db.prepare(
                        `
                        SELECT id, artist_name FROM album JOIN album_artist ON album.id=album_artist.album_id
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

            existingAlbumStmt.get(params, (err, row: AlbumModel) => {
                resolve(row)
            })
            existingAlbumStmt.finalize()
        })
    }

    /**
     * Adds an album to the database from the provided AlbumData data object.
     *
     * TODO: Handle updates (rather than 'IGNORE INTO') [for extra genres]
     *
     * @param album Album to add
     */
    addAlbum(album: Album): Promise<void> {
        return new Promise((resolve) => {
            const genreStmt = this.db.prepare(
                'INSERT OR IGNORE INTO album_genre VALUES (?, ?)'
            )
            const artistStmt = this.db.prepare(
                'INSERT OR IGNORE INTO album_artist VALUES (?, ?)'
            )

            const albumStmt = this.db.prepare(
                'INSERT INTO album VALUES (NULL, ?, ?, ?, ?, ?)'
            )
            albumStmt.run(
                album.title,
                album.year,
                album.totalTracks,
                album.totalDisks,
                album.rating,
                function () {
                    const albumID = this.lastID

                    for (const genre of album.genres) {
                        genreStmt.run(albumID, genre)
                    }
                    genreStmt.finalize()

                    for (const artist of album.artists) {
                        artistStmt.run(albumID, artist)
                    }
                    artistStmt.finalize()
                }
            )
            albumStmt.finalize(() => {
                resolve()
            })
        })
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
                (album: AlbumModel) => {
                    this.db.parallelize(async () => {
                        // Update all genres
                        await Promise.all(
                            song.genres.map((genre) => this.addGenre(genre))
                        )

                        // Update all artists
                        await Promise.all(
                            song.artists.map((artist) => this.addArtist(artist))
                        )

                        const songStmt = this.db.prepare(
                            'INSERT OR REPLACE INTO song VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?)'
                        )

                        const genreStmt = this.db.prepare(
                            'INSERT OR IGNORE INTO song_genre VALUES (?, ?)'
                        )
                        const artistStmt = this.db.prepare(
                            'INSERT OR IGNORE INTO song_artist VALUES (?, ?)'
                        )

                        songStmt.run(
                            song.path,
                            song.title,
                            song.year,
                            song.track,
                            song.disk,
                            song.duration,
                            song.rating,
                            album.id,
                            function () {
                                const songID = this.lastID
                                for (const genre of song.genres) {
                                    genreStmt.run(songID, genre)
                                }
                                genreStmt.finalize()

                                for (const artist of song.artists) {
                                    artistStmt.run(songID, artist)
                                }
                                artistStmt.finalize()
                            }
                        )
                        songStmt.finalize(() => {
                            resolve()
                        })
                    })
                }
            )
        })
    }

    getSong(path: string): Promise<Song> {
        return new Promise((resolve) => {
            // TODO: join genres
            // TODO: join artists
            // TODO: join album
            const songStmt = this.db.prepare(
                'SELECT * FROM song WHERE path = ?'
            )

            songStmt.get(path, (err, row: SongModel) => {
                const resultSong: Song = new Song()
                    .setDisk(row.disk)
                    .setDuration(row.duration)
                    .setRating(row.rating)
                    .setPath(path)
                    .setTitle(row.title)
                    .setTrack(row.track)
                    .setYear(row.year)

                resolve(resultSong)
            })

            songStmt.finalize()
        })
    }

    /**
     * Adds a genre to the database. If the genre already exists, does nothing.
     *
     * @param genre  Genre to add
     */
    addGenre(genre: string): Promise<void> {
        return new Promise((resolve) => {
            this.db.serialize(() => {
                const genreStmt = this.db.prepare(
                    'INSERT OR IGNORE INTO genre VALUES(?)'
                )

                genreStmt.run(genre)
                genreStmt.finalize(() => {
                    resolve()
                })
            })
        })
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
    addArtist(artist: string): Promise<void> {
        return new Promise((resolve) => {
            this.db.serialize(async () => {
                const artistStmt = this.db.prepare(
                    'INSERT OR IGNORE INTO artist VALUES(?)'
                )

                artistStmt.run(artist)
                artistStmt.finalize(() => {
                    resolve()
                })
            })
        })
    }

    /**
     * Creates data tables.
     */
    initializeTables() {
        this.db.serialize(() => {
            this.db.run('PRAGMA foreign_keys = ON')

            this.db.run(`CREATE TABLE IF NOT EXISTS song(
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

            this.db.run(`CREATE TABLE IF NOT EXISTS album(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                year INTEGER,
                total_tracks INTEGER,
                total_disks INTEGER,
                rating INTEGER
            )`)

            this.db.run(`CREATE TABLE IF NOT EXISTS genre(
                name TEXT PRIMARY KEY
            )`)

            this.db.run(`CREATE TABLE IF NOT EXISTS artist(
                name TEXT PRIMARY KEY
            )`)

            this.db.run(`CREATE TABLE IF NOT EXISTS song_genre(
                song_id INTEGER,
                genre TEXT,
                FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE,
                FOREIGN KEY(genre) REFERENCES genre(name) ON DELETE CASCADE,
                PRIMARY KEY(song_id, genre)
            )`)

            this.db.run(`CREATE TABLE IF NOT EXISTS album_genre(
                album_id INTEGER,
                genre TEXT,
                FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE,
                FOREIGN KEY(genre) REFERENCES genre(name) ON DELETE CASCADE,
                PRIMARY KEY(album_id, genre)
            )`)

            this.db.run(`CREATE TABLE IF NOT EXISTS song_artist(
                song_id INTEGER,
                artist_name TEXT,
                FOREIGN KEY(song_id) REFERENCES song(id) ON DELETE CASCADE,
                FOREIGN KEY(artist_name) REFERENCES artist(name) ON DELETE CASCADE,
                PRIMARY KEY(song_id, artist_name)
            )`)

            this.db.run(`CREATE TABLE IF NOT EXISTS album_artist(
                album_id INTEGER,
                artist_name TEXT,
                FOREIGN KEY(album_id) REFERENCES album(id) ON DELETE CASCADE,
                FOREIGN KEY(artist_name) REFERENCES artist(name) ON DELETE CASCADE,
                PRIMARY KEY(album_id, artist_name)
            )`)
        })
    }
}

// Create in-memory database
const appDB = new AppDatabase('test.db')

// Export app database singleton
export default appDB
