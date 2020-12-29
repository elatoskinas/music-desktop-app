import { Song, Album } from '@data/music-data'

describe('Song tests', () => {
    let songData: Song

    beforeEach(() => {
        songData = new Song()
    })

    test('Set artists', () => {
        expect(songData.artists).toEqual([])

        const artists = ['Artisti 1', 'Artist 2']
        let returnSong = songData.setArtists(artists)

        // Assert returned song is exactly the initial song data;
        // Ensure property setter has worked
        expect(returnSong).toBe(songData)
        expect(songData.artists).toEqual(artists)
    })

    test('Set duration', () => {
        expect(songData.duration).toBeUndefined()

        const duration = 15
        let returnSong = songData.setDuration(duration)

        expect(returnSong).toBe(songData)
        expect(songData.duration).toEqual(duration)
    })

    test('Set title', () => {
        expect(songData.title).toBeUndefined()

        const title = 'Song Title'
        let returnSong = songData.setTitle(title)

        expect(returnSong).toBe(songData)
        expect(songData.title).toEqual(title)
    })

    test('Set album', () => {
        expect(songData.album).toBeUndefined()

        const album = new Album()
        let returnSong = songData.setAlbum(album)

        expect(returnSong).toBe(songData)
        expect(songData.album).toBe(album)
    })
})
