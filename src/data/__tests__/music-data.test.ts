import {Song, SongData, Album, AlbumData} from '@data/music-data'

describe('SongData tests', () => {
    let songData: SongData

    beforeEach(() => {
        songData = new SongData()
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
        expect(songData.title).toEqual('Unknown Song')

        const title = 'Song Title'
        let returnSong = songData.setTitle(title)

        expect(returnSong).toBe(songData)
        expect(songData.title).toEqual(title)
    })

    test('Set album', () => {
        expect(songData.album).toBeUndefined()

        const album = new AlbumData()
        let returnSong = songData.setAlbum(album)

        expect(returnSong).toBe(songData)
        expect(songData.album).toBe(album)
    })
})

describe('AlbumData tests', () => {
    let albumData: AlbumData

    beforeEach(() => {
        albumData = new AlbumData()
    })

    test('Set artist', () => {
        expect(albumData.artist).toEqual('Unknown Artist')

        const artist = 'Album Artist'
        let returnAlbum = albumData.setArtist(artist)

        expect(returnAlbum).toBe(albumData)
        expect(albumData.artist).toEqual(artist)
    })
})

describe('Album & Song tests', () => {
    test('Create Song', () => {
        const data = new SongData()
        const path = 'some/path/to/file'

        let song = new Song(data, path)

        expect(song.data).toBe(data)
        expect(song.path).toBe(path)
    })

    test('Create Album', () => {
        const data = new AlbumData()

        let album = new Album(data)
        
        expect(album.data).toBe(data)
        expect(album.songs).toEqual([])
    })
})