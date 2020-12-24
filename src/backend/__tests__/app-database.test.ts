import AppDatabase from '../app-database'
import { AlbumData, Song, SongData } from '@data/music-data'

describe('Album table tests', () => {
    test('Query non-existent', async () => {
        const resultingAlbum = await AppDatabase.getAlbum('randomTitle', 'withRandomArtist')
        expect(resultingAlbum).toBeUndefined()
    })

    test('Add album with artist, title, year', async () => {
        const artist = 'Test Artist'
        const title = 'Test Album Title'
        const year = 2020


        const album = new AlbumData()
            .setArtist(artist)
            .setTitle(title)
            .setYear(year)

        await AppDatabase.addAlbum(album)

        const queriedAlbum: any = await AppDatabase.getAlbum(title, artist)
        expect(queriedAlbum).toBeDefined()
    })

    test('Add album with no parameters', async () => {
        const album = new AlbumData()

        await AppDatabase.addAlbum(album)

        const queriedAlbum: any = await AppDatabase.getAlbum(undefined, undefined)
        expect(queriedAlbum).toBeDefined()
    })

    test('Add album with only artist', async () => {
        const artist = 'Test Artist'
        const album = new AlbumData()
            .setArtist(artist)

        await AppDatabase.addAlbum(album)

        const queriedAlbum: any = await AppDatabase.getAlbum(undefined, artist)
        expect(queriedAlbum).toBeDefined()
    })

    test('Add album with only title', async () => {
        const title = 'Test title'
        const album = new AlbumData()
            .setTitle(title)

        await AppDatabase.addAlbum(album)

        const queriedAlbum: any = await AppDatabase.getAlbum(title, undefined)
        expect(queriedAlbum).toBeDefined()
    })
})

describe('Song table tests', () => {
    test('Add song with no parameters', async () => {
        const path = 'test/path.mp3'
        const song = new Song(new SongData().setAlbum(new AlbumData()), path)

        await AppDatabase.addSong(song)

        // TODO: test song added properly
    })
    
    test('Add song with data', async () => {
        const songData = new SongData()
            .setArtists(['Artist'])
            .setDisk(1)
            .setDuration(47)
            .setTitle('Title')
            .setTrack(1)
            .setYear(2019)
            .setAlbum(new AlbumData())

        const song = new Song(songData, 'test/path.wav')

        await AppDatabase.addSong(song)

        // TODO: Test song added properly
    })

    test('Replace song', async () => {
        const songData1 = new SongData().setAlbum(new AlbumData())
        const songData2 = new SongData()
            .setTitle('Track')
            .setArtists(['Artist'])
            .setAlbum(new AlbumData())
        const path = 'path/to/song.flac'

        await AppDatabase.addSong(new Song(songData1, path))
        // TODO: Verify song added

        await AppDatabase.addSong(new Song(songData2, path))
        // TODO: verify song replaced correctly
    })
})

describe('Song & album integration', () => {
    test('Add song with album', async () => {
        const albumData = new AlbumData()
            .setArtist('Artist')
            .setTitle('Some album name')
            .setYear(2018)

        const songData = new SongData()
            .setTitle('Song')
            .setAlbum(albumData)

        await AppDatabase.addSong(new Song(songData, 'test/path.mp3'))

        const queriedAlbum: any = await AppDatabase.getAlbum(albumData.title, albumData.artist)
        expect(queriedAlbum).toBeDefined()
    })
})
