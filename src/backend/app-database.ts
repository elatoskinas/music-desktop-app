import * as sqlite3 from 'sqlite3'
import { AlbumData, Song } from '@data/music-data'
import queue from 'async/queue'

/**
 * Component encapsulating the central application database.
 *
 * TODO: Split into different components/DAOs?
 * TODO: Song add query can probably be optimized
 *       (using 1 fetch instead of 2?)
 * TODO: Look into secondary indices
 * TODO: Make SongData and AlbumData function calls consistent
 *       (use either Album and Song OR AlbumData and SongData)
 */
class AppDatabase {
    db: sqlite3.Database
    albumInsertQueue: any

    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath)

        this.albumInsertQueue = new queue(async (task, callback) => {
            // Update all genres
            await Promise.all(
                task.data.genres.map((genre) => this.addGenre(genre))
            )

            // Update all artists
            await Promise.all(
                task.data.artists.map((artist) => this.addArtist(artist))
            )

            const album = await this.getOrAddAlbum(task.data.album)
            callback(album)
        }, 1)

        this.initializeTables()
    }

    /**
     * Fetches album with given title & artist.
     * If such entry does not exist, 'undefined' will be returned.
     *
     * @param album Album to fetch (uses title & artists from object)
     */
    getAlbum(album: AlbumData) {
        return new Promise((resolve) => {
            const titleCondition = album.title ? 'title = ?' : 'title iS NULL'

            const inQueryPlaceholder = album.artists
                .map(() => {
                    return '?'
                })
                .join(', ')

            const existingAlbumStmt = album.artists.length == 0 ? this.db.prepare(
                `SELECT id FROM album WHERE ${titleCondition} LIMIT 1`
            ) : this.db.prepare(
                `
                SELECT id, artist_name FROM album JOIN album_artist ON album.id=album_artist.album_id
                WHERE ${titleCondition} AND artist_name IN (${inQueryPlaceholder}) LIMIT 1
                `
            )

            const params = []

            if (album.title) {
                params.push(album.title)
            }

            for (const artist of album.artists) {
                params.push(artist)
            }

            existingAlbumStmt.get(params, (err, row) => {
                resolve(row)
            })
            existingAlbumStmt.finalize()
        })
    }

    getOrAddAlbum(album: AlbumData) {
        return new Promise((resolve) => {
            this.db.serialize(async () => {
                let albumEntry: any = await this.getAlbum(album)

                if (!albumEntry) {
                    await this.addAlbum(album)
                    albumEntry = await this.getAlbum(album)
                }

                resolve(albumEntry)
            })
        })
    }

    /**
     * Adds an album to the database from the provided AlbumData data object.
     * If an album with the same title & album already exists, then no insertion
     * is performed.
     *
     * TODO: Handle updates (rather than 'IGNORE INTO') [for extra genres]
     *
     * @param album Album to add
     */
    addAlbum(album: AlbumData): Promise<void> {
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
     * @param song Song to add
     */
    async addSong(song: Song) {
        this.albumInsertQueue.push({ data: song.data }, (album) => {
            this.db.parallelize(async () => {
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
                    song.data.title,
                    song.data.year,
                    song.data.track,
                    song.data.disk,
                    song.data.duration,
                    song.data.rating,
                    album.id,
                    function () {
                        const songID = this.lastID
                        for (const genre of song.data.genres) {
                            genreStmt.run(songID, genre)
                        }
                        genreStmt.finalize()

                        for (const artist of song.data.artists) {
                            artistStmt.run(songID, artist)
                        }
                        artistStmt.finalize()
                    }
                )
                songStmt.finalize()
            })
        })
    }

    /**
     * Adds a genre to the database. If the genre already exists, does nothing.
     *
     * @param genre  Genre to add
     */
    async addGenre(genre: string): Promise<void> {
        return await new Promise((resolve) => {
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
    async addArtist(artist: string): Promise<void> {
        return await new Promise((resolve) => {
            this.db.serialize(() => {
                const artistStmt = this.db.prepare(
                    'INSERT OR IGNORE INTO artist VALUES(?)'
                )

                artistStmt.run(artist, () => {
                    resolve()
                })

                artistStmt.finalize()
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
