import AppDatabase from '../app-database'
import { Song } from '@data/music-data'

describe('Album table tests', () => {
    // Query non existent
    // Add & query no artist, no title
    // Add & query no artist, with title
    // Add & query 1 artist, with title
    // Add & query 1 artist, no title
    // Add & query multi artists with title
    // Add & query multi artists partial match
    // Add & query duplicate (identical)
    // Add & query duplicate (extra genres)
    // Add & query duplicate (extra artists)

    // test('Query non-existent', async () => {
    //     const resultingAlbum = await AppDatabase.getAlbum(
    //         'randomTitle',
    //         'withRandomArtist'
    //     )
    //     expect(resultingAlbum).toBeUndefined()
    // })

    // test('Add album with artist, title, year', async () => {
    //     const artist = 'Test Artist'
    //     const title = 'Test Album Title'
    //     const year = 2020

    //     const album = new AlbumData()
    //         .setArtist(artist)
    //         .setTitle(title)
    //         .setYear(year)

    //     await AppDatabase.addAlbum(album)

    //     const queriedAlbum: any = await AppDatabase.getAlbum(title, artist)
    //     expect(queriedAlbum).toBeDefined()
    // })

    // test('Add album with no parameters', async () => {
    //     const album = new AlbumData()

    //     await AppDatabase.addAlbum(album)

    //     const queriedAlbum: any = await AppDatabase.getAlbum(
    //         undefined,
    //         undefined
    //     )
    //     expect(queriedAlbum).toBeDefined()
    // })

    // test('Add album with only artist', async () => {
    //     const artist = 'Test Artist'
    //     const album = new AlbumData().setArtist(artist)

    //     await AppDatabase.addAlbum(album)

    //     const queriedAlbum: any = await AppDatabase.getAlbum(undefined, artist)
    //     expect(queriedAlbum).toBeDefined()
    // })

    // test('Add album with only title', async () => {
    //     const title = 'Test title'
    //     const album = new AlbumData().setTitle(title)

    //     await AppDatabase.addAlbum(album)

    //     const queriedAlbum: any = await AppDatabase.getAlbum(title, undefined)
    //     expect(queriedAlbum).toBeDefined()
    // })
})

describe('Song table tests', () => {
    test('Add song with no data', async () => {
        const path = 'test/path.mp3'
        const song = new Song().setPath(path)

        await AppDatabase.addSong(song)

        const resultSong: Song = await AppDatabase.getSong(path)
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

        const resultSong: Song = await AppDatabase.getSong(song.path)

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

        const resultSong: Song = await AppDatabase.getSong(song.path)

        expect(resultSong).toBeDefined()
        expect(resultSong.genres).toHaveLength(song.genres.length)
        expect(resultSong.genres).toEqual(jasmine.arrayContaining(song.genres))
    })

    test('Add song with artists', async () => {
        const song = new Song()
            .setPath('test/path3.wav')
            .setArtists(['artist1', 'artist2', 'artist3'])

        await AppDatabase.addSong(song)

        const resultSong: Song = await AppDatabase.getSong(song.path)

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

        const resultSong1: Song = await AppDatabase.getSong(song1.path)

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

// describe('Song & album integration', () => {
//     test('Add song with album', async () => {
//         const albumData = new AlbumData()
//             .setArtist('Artist')
//             .setTitle('Some album name')
//             .setYear(2018)

//         const songData = new SongData().setTitle('Song').setAlbum(albumData)

//         await AppDatabase.addSong(new Song(songData, 'test/path.mp3'))

//         const queriedAlbum: any = await AppDatabase.getAlbum(
//             albumData.title,
//             albumData.artist
//         )
//         expect(queriedAlbum).toBeDefined()
//     })
// })
