import * as sqlite3 from 'sqlite3'
import { AlbumData, Song } from '@data/music-data'

/**
 * Component encapsulating the central application database.
 * 
 * TODO: Split into different components/DAOs?
 * TODO: Song add query can probably be optimized
 *       (using 1 fetch instead of 2?)
 * TODO: Look into secondary indices
 */
class AppDatabase {
    db: sqlite3.Database

    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath)
        this.initializeTables()
    }

    /**
     * Fetches album with given title & artist.
     * If such entry does not exist, 'undefined' will be returned.
     * 
     * @param title Title of album to fetch
     * @param artist Artist of album to fetch
     */
    async getAlbum(title: string, artist: string) {
        return await new Promise((resolve) => {
            const titleCondition = title ? 'title = ?' : 'title iS NULL'
            const artistCondition = artist ? 'artist = ?' : 'artist IS NULL'

            const params = []
            if (title) {
                params.push(title)
            }

            if (artist) {
                params.push(artist)
            }

            const existingAlbumStmt = this.db.prepare(`SELECT id FROM album WHERE ${titleCondition} AND ${artistCondition} LIMIT 1`)
            existingAlbumStmt.get(params, (err, row) => {
                resolve(row)
            })
            existingAlbumStmt.finalize()
        })
    }

    /**
     * Adds an album to the database from the provided AlbumData data object.
     * If an album with the same title & album already exists, then no insertion
     * is performed.
     * 
     * @param album Album to add
     */
    async addAlbum(album: AlbumData): Promise<void> {
        return await new Promise((resolve) => {
            this.db.serialize(async () => {
                const albumStmt = this.db.prepare('INSERT OR IGNORE INTO album VALUES (NULL, ?, ?, ?, ?, ?)')
                albumStmt.run(album.title, album.artist, album.year, album.totalTracks, album.totalDisks, () => {
                    resolve()
                })
                albumStmt.finalize()
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
        let albumEntry: any = await this.getAlbum(song.data.album.title, song.data.album.artist)

        if (!albumEntry) {
            await this.addAlbum(song.data.album)
            albumEntry = await this.getAlbum(song.data.album.title, song.data.album.artist)
        }

        const songStmt = this.db.prepare('INSERT INTO song VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)')
        songStmt.run(song.path, song.data.title, song.data.year, song.data.track, song.data.disk, song.data.duration, albumEntry.id)
        songStmt.finalize()
    }

    /**
     * List songs
     */
    listSongs(callback: Function) {
        this.db.all('SELECT * FROM song ORDER BY title', (err, rows) => {
            callback(rows)
        })
    }

    /**
     * Creates data tables.
     * TODO: Check for table existence, create only if not present
     */
    initializeTables() {
        this.db.serialize(() => {
            // TODO: normalize tables

            this.db.run(`CREATE TABLE IF NOT EXISTS song(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                path TEXT UNIQUE,
                title TEXT,
                year INTEGER,
                track INTEGER,
                disk INTEGER,
                duration FLOAT,
                albumId INTEGER,
                FOREIGN KEY(albumId) REFERENCES album(id)
            )`)

            this.db.run(`CREATE TABLE IF NOT EXISTS album(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                artist TEXT,
                year INTEGER,
                total_tracks INTEGER,
                total_disks INTEGER,
                UNIQUE(title, artist)
            )`)

            // TODO: track artists
            // TODO: genres
        })
    }
}

// Create in-memory database
const appDB = new AppDatabase(':memory:')

// Export app database singleton
export default appDB