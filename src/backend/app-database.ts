import * as sqlite3 from 'sqlite3'
import { Song } from '@data/music-data'

/**
 * Component encapsulating the central application database.
 */
class AppDatabase {
    db: sqlite3.Database

    constructor(dbFilePath) {
        this.db = new sqlite3.Database(dbFilePath)
        this.initializeTables()
    }

    /**
     * Adds song
     * @param song Song to add
     */
    addSong(song: Song) {
        const stmt = this.db.prepare(`INSERT INTO song VALUES (?, ?, ?)`)
        stmt.run(song.path, song.data.title, song.data.track)
        stmt.finalize()
    }

    /**
     * List songs
     */
    listSongs(callback: Function) {
        this.db.all("SELECT * FROM song ORDER BY title", (err, rows) => {
            callback(rows)
        })
    }

    /**
     * Creates data tables.
     * TODO: Check for table existence, create only if not present
     */
    initializeTables() {
        this.db.serialize(() => {
            this.db.run("CREATE TABLE song(path TEXT, title TEXT, track INTEGER)")
        })
    }
}

// Create in-memory database
const appDB = new AppDatabase(":memory:")

// Export app database singleton
export default appDB