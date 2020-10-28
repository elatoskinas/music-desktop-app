import AppDatabase from '../app-database'
import { AlbumData } from '@data/music-data'

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
