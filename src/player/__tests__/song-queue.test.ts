import {SongQueue} from '@player/song-queue.ts'
import {Song, SongData, Album, AlbumData} from '@music-data/music-data.ts'

let songQueue: SongQueue

beforeEach(() => {
    songQueue = new SongQueue()
})

describe('Empty queue tests', () => {
    test('Test initialize queue', () => {
        expect(songQueue.songCount()).toBe(0)
    })
    
    test('Test pop no songs', () => {
        let song = songQueue.next()
    
        // Assert that no song gets retrieved, and that
        // the song queue does not shrink in size unexpectedly
        expect(song).toBeUndefined()
        expect(songQueue.songCount()).toBe(0)
    })
    
})

describe('Queue sequential tests', () => {
    describe('Single song tests', () => {
        let song: Song

        beforeEach(() => {
            song = new Song(new SongData(), 'test/path')
        })

        test('Test add & remove song', () => {
            expect(songQueue.songCount()).toBe(0)
            songQueue.addSong(song)
            expect(songQueue.songCount()).toBe(1)
    
            let nextSong = songQueue.next()
    
            expect(nextSong).toBe(song)
            expect(songQueue.songCount()).toBe(0)
        })
    
        test('Test add remove remove', () => {
            songQueue.addSong(song)
            
            expect(songQueue.next()).toBe(song)
            expect(songQueue.next()).toBeUndefined()
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
            expect(songQueue.next()).toBe(songs[0])
    
            expect(songQueue.songCount()).toBe(2)
            expect(songQueue.next()).toBe(songs[1])
            
            expect(songQueue.songCount()).toBe(1)
            expect(songQueue.next()).toBe(songs[2])
            
            expect(songQueue.songCount()).toBe(0)
            expect(songQueue.next()).toBeUndefined()
        })
    
        test('Test fill from album', () => {
            let albumData = new AlbumData()
            let album = new Album(albumData)

            for (const song of songs) {
                album.addSong(song)
            }

            songQueue.addAlbum(album)

            expect(songQueue.songCount()).toBe(3)
            expect(songQueue.next()).toBe(songs[0])
            songQueue.next()
            expect(songQueue.next()).toBe(songs[2])
            expect(songQueue.songCount()).toBe(0)
        })
    })
})