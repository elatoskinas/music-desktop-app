import AppDatabase from '../app-database'
import { Album, Song } from '@data/music-data'

describe('Album table tests', () => {
    test('Query non-existent', () => {
        const resultAlbum = AppDatabase.getAlbum(
            new Album().setTitle('randomTitle').setArtists(['randomArtist'])
        )
        expect(resultAlbum).toBeNull()
    })

    test('Add & query no artist, no title', () => {
        const album = new Album()

        AppDatabase.addAlbum(album)

        const resultAlbum = AppDatabase.getAlbum(album)
        expect(resultAlbum).toBeDefined()
        expect(resultAlbum.title).toBeNull()
        expect(resultAlbum.artists).toHaveLength(0)
    })

    test('Add & query no artist, with title', () => {
        const album = new Album().setTitle('Album Title')

        AppDatabase.addAlbum(album)

        const resultAlbum = AppDatabase.getAlbum(album)
        expect(resultAlbum).toBeDefined()
        expect(resultAlbum.title).toEqual(album.title)
        expect(resultAlbum.artists).toHaveLength(0)
    })

    test('Add & query 1 artist, with title', () => {
        const album = new Album().setTitle('Album Title').setArtists(['Artist'])

        AppDatabase.addAlbum(album)

        const resultAlbum = AppDatabase.getAlbum(album)
        expect(resultAlbum).toBeDefined()
        expect(resultAlbum.title).toEqual(album.title)
        expect(resultAlbum.artists).toEqual(album.artists)
    })

    test('Add & query 1 artist, no title', () => {
        const album = new Album().setArtists(['Artist'])

        AppDatabase.addAlbum(album)

        const resultAlbum = AppDatabase.getAlbum(album)
        expect(resultAlbum).toBeDefined()
        expect(resultAlbum.title).toBeNull()
        expect(resultAlbum.artists).toEqual(album.artists)
    })

    test('Add & query multi artists, with title', () => {
        const album = new Album()
            .setTitle('Multi-artist title')
            .setArtists(['Artist1', 'Artist2', 'Artist3'])

        AppDatabase.addAlbum(album)

        const resultAlbum = AppDatabase.getAlbum(album)
        expect(resultAlbum).toBeDefined()
        expect(resultAlbum.title).toEqual(album.title)
        expect(resultAlbum.artists).toEqual(album.artists)
    })

    test('Add & query identical album', () => {
        const album = new Album().setTitle('DUPE TITLE').setArtists(['Artist'])

        const album2 = new Album()
            .setTitle(album.title)
            .setArtists(album.artists)

        AppDatabase.addAlbum(album)

        const originalAlbum = AppDatabase.getAlbum(album)
        const resultAlbum = AppDatabase.getOrAddAlbum(album2)

        expect(resultAlbum.id).toEqual(originalAlbum.id)
    })

    test('Add & query same title different artist albums', () => {
        const album = new Album()
            .setTitle('DUPE TITLE MULTI')
            .setArtists(['Artist1'])

        const album2 = new Album().setTitle(album.title).setArtists(['Artist2'])

        AppDatabase.addAlbum(album)

        const originalAlbum = AppDatabase.getAlbum(album)
        const resultAlbum = AppDatabase.getOrAddAlbum(album2)

        expect(resultAlbum.id).not.toEqual(originalAlbum.id)
    })

    // TODO: Add & query duplicate (extra genres)
    // TODO: Add & query duplicate (extra artists)
    // TODO: Add & query duplicate (multi-artist partial match)
})

describe('Song table tests', () => {
    test('Add song with no data', async () => {
        const path = 'test/path.mp3'
        const song = new Song().setPath(path)

        await AppDatabase.addSong(song)

        const resultSong: Song = AppDatabase.getSong(path)
        expect(resultSong).toBeDefined()
        expect(resultSong.path).toEqual(song.path)
    })

    test('Add song with simple data', async () => {
        const song = new Song()
            .setPath('test/path.wav')
            .setDisk(1)
            .setDuration(47)
            .setTitle('Title')
            .setTrack(1)
            .setYear(2019)

        await AppDatabase.addSong(song)

        const resultSong: Song = AppDatabase.getSong(song.path)

        expect(resultSong).toBeDefined()
        expect(resultSong.path).toEqual(song.path)
        expect(resultSong.disk).toEqual(song.disk)
        expect(resultSong.duration).toEqual(song.duration)
        expect(resultSong.title).toEqual(song.title)
        expect(resultSong.track).toEqual(song.track)
        expect(resultSong.year).toEqual(song.year)
    })

    test('Add song with genres', async () => {
        const song = new Song()
            .setPath('test/path2.wav')
            .setGenres(['genre1', 'genre2'])

        await AppDatabase.addSong(song)

        const resultSong: Song = AppDatabase.getSong(song.path)

        expect(resultSong).toBeDefined()
        expect(resultSong.genres).toHaveLength(song.genres.length)
        expect(resultSong.genres).toEqual(jasmine.arrayContaining(song.genres))
    })

    test('Add song with artists', async () => {
        const song = new Song()
            .setPath('test/path3.wav')
            .setArtists(['artist1', 'artist2', 'artist3'])

        await AppDatabase.addSong(song)

        const resultSong: Song = AppDatabase.getSong(song.path)

        expect(resultSong).toBeDefined()
        expect(resultSong.artists).toHaveLength(song.artists.length)
        expect(resultSong.artists).toEqual(
            jasmine.arrayContaining(song.artists)
        )
    })

    test('Replace song simple', async () => {
        const path = 'path/to/song.flac'
        const song1 = new Song().setPath(path).setDisk(1).setTrack(1)
        const song2 = new Song()
            .setPath(path)
            .setDisk(2)
            .setTrack(3)
            .setDuration(32)

        await AppDatabase.addSong(song1)

        const resultSong1: Song = AppDatabase.getSong(song1.path)

        expect(resultSong1).toBeDefined()
        expect(resultSong1.disk).toEqual(song1.disk)
        expect(resultSong1.track).toEqual(song1.track)
        expect(resultSong1.duration).toBeNull()

        await AppDatabase.addSong(song2)

        const resultSong2: Song = await AppDatabase.getSong(song2.path)

        expect(resultSong2).toBeDefined()
        expect(resultSong2.disk).toEqual(song2.disk)
        expect(resultSong2.track).toEqual(song2.track)
        expect(resultSong2.duration).toEqual(song2.duration)
    })

    // TODO: Test replace for artist linking
    // TODO: test replace for genre linking
})

describe('Song & album integration', () => {
    test('Add song with album', async () => {
        const path = 'test/with_album.mp3'
        const song = new Song()
            .setPath(path)
            .setAlbum(new Album().setArtists(['Artist1']).setTitle('Title123'))

        await AppDatabase.addSong(song)

        const resultSong: Song = AppDatabase.getSong(path)

        expect(resultSong).toBeDefined()
        expect(resultSong.path).toEqual(path)
        expect(resultSong.album.title).toEqual(song.album.title)
        expect(resultSong.album.artists).toEqual(song.album.artists)
    })
})
