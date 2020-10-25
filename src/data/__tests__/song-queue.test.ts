import {SongQueue} from '@data/song-queue.ts'
import {Song, SongData, Album, AlbumData} from '@data/music-data.ts'

let songQueue: SongQueue

beforeEach(() => {
    songQueue = new SongQueue()
})

describe('Empty queue tests', () => {
    test('Test initialize queue', () => {
        expect(songQueue.songCount()).toBe(0)
    })
    
    test('Test next no song', () => {
        let song = songQueue.next()
    
        // Assert that no song gets retrieved, and that
        // the song queue does not shrink in size unexpectedly
        expect(song).toBeUndefined()
        expect(songQueue.songCount()).toBe(0)
    })
    
})

describe('Single song tests', () => {
    let song: Song

    beforeEach(() => {
        song = new Song(new SongData(), 'test/path')
    })

    test('Test add song', () => {
        expect(songQueue.current()).toBeUndefined()
        expect(songQueue.songCount()).toBe(0)

        songQueue.addSong(song)
        expect(songQueue.songCount()).toBe(1)
        expect(songQueue.current()).toBe(song)
    })

    test('Test add & next song', () => {
        songQueue.addSong(song)

        // Ensure song loaded to queue as first song
        expect(songQueue.songCount()).toBe(1)
        expect(songQueue.current()).toBe(song)

        // Assert wrapping of song
        expect(songQueue.next()).toBe(song)
        expect(songQueue.current()).toBe(song)
    })

    test('Test previous wrapping', () => {
        songQueue.addSong(song)

        expect(songQueue.songCount()).toBe(1)
        expect(songQueue.current()).toBe(song)
        expect(songQueue.previous()).toBe(song)
        expect(songQueue.current()).toBe(song)
    })

    test('Test next to previous wrapping', () => {
        songQueue.addSong(song)

        expect(songQueue.current()).toBe(song)
        expect(songQueue.next()).toBe(song)
        expect(songQueue.current()).toBe(song)
        expect(songQueue.previous()).toBe(song)
    })

    test('Test next to previous edge multiple', () => {
        songQueue.addSong(song)

        expect(songQueue.current()).toBe(song)
        expect(songQueue.next()).toBe(song)
        expect(songQueue.next()).toBe(song)
        expect(songQueue.next()).toBe(song)
        expect(songQueue.current()).toBe(song)
        expect(songQueue.previous()).toBe(song)
    })
})

describe('Multiple song test', () => {
    let songs: Song[]

    beforeEach(() => {
        songs = []
        songs.push(new Song(new SongData(), 'test/path1'))
        songs.push(new Song(new SongData(), 'test/path2'))
        songs.push(new Song(new SongData(), 'test/path3'))
    })

    test('Test add multiple songs', () => {
        for (const song of songs) {
            songQueue.addSong(song)
        }

        expect(songQueue.songCount()).toBe(3)

        // Run a full loop through the queue
        expect(songQueue.current()).toBe(songs[0])
        expect(songQueue.next()).toBe(songs[1])
        expect(songQueue.next()).toBe(songs[2])
        expect(songQueue.next()).toBe(songs[0])
    })

    test('Test multiple songs previous & next', () => {
        for (const song of songs) {
            songQueue.addSong(song)
        }

        expect(songQueue.songCount()).toBe(3)

        // Run a double wrapping loop around the queue
        expect(songQueue.current()).toBe(songs[0])
        expect(songQueue.previous()).toBe(songs[2])
        expect(songQueue.previous()).toBe(songs[1])
        expect(songQueue.next()).toBe(songs[2])
        expect(songQueue.next()).toBe(songs[0])
    })

    test('Test fill from album', () => {
        let albumData = new AlbumData()
        let album = new Album(albumData)

        for (const song of songs) {
            album.addSong(song)
        }

        songQueue.addAlbum(album)

        expect(songQueue.songCount()).toBe(3)
        expect(songQueue.current()).toBe(songs[0])
        songQueue.next()
        expect(songQueue.next()).toBe(songs[2])
    })

    test('Test has next state', () => {
        for (const song of songs) {
            songQueue.addSong(song)
        }

        expect(songQueue.songCount()).toBe(3)

        expect(songQueue.current()).toBe(songs[0])
        expect(songQueue.hasNext()).toBe(true)
        expect(songQueue.next()).toBe(songs[1])
        expect(songQueue.hasNext()).toBe(true)
        expect(songQueue.next()).toBe(songs[2])
        expect(songQueue.hasNext()).toBe(false)
    })
})