import { Song, Album } from '@data/music-data'
import { AlbumModel, SongModel } from '@data/music-model'

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
        const album = new Album()
        let returnSong = songData.setAlbum(album)

        expect(returnSong).toBe(songData)
        expect(songData.album).toBe(album)
    })

    test('Create from model', () => {
        const model: SongModel = {
            id: 5,
            path: 'test/path.mp3',
            title: 'Title',
            disk: 3,
            track: 1,
            year: 2018,
            duration: 423.42,
            rating: 4,
            albumId: 1,
        }

        const song: Song = Song.create(model)
        const expectedSong: Song = new Song()
            .setId(model.id)
            .setPath(model.path)
            .setTitle(model.title)
            .setDisk(model.disk)
            .setTrack(model.track)
            .setYear(model.year)
            .setDuration(model.duration)
            .setRating(model.rating)

        expect(song).toEqual(expectedSong)
    })
})

describe('Album tests', () => {
    test('Create from model', () => {
        const model: AlbumModel = {
            id: 3,
            title: 'Album',
            total_disks: 3,
            total_tracks: 24,
            year: 2018,
            rating: 3,
        }

        const album: Album = Album.create(model)
        const expectedAlbum: Album = new Album()
            .setId(model.id)
            .setRating(model.rating)
            .setTitle(model.title)
            .setTotalDisks(model.total_disks)
            .setTotalTracks(model.total_tracks)
            .setYear(model.year)

        expect(album).toEqual(expectedAlbum)
    })
})
