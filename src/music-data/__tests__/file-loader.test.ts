import * as fileLoader from '@music-data/file-loader.ts'
import * as metadata from 'music-metadata'

afterEach(() => {
    // Restore all mocks in case of spying
    jest.restoreAllMocks()
})

/**
 * Existing file tests (mocked unit tests)
 */
describe('Load sound existing file tests', () => {
    test('Load sound existing metadata test', () => {
        // Spy on parseFile to re-define return value
        const spy = jest.spyOn(metadata, 'parseFile')


        // Initialize expected data dictionary for song data
        const expectedDataDict = {
            'title': 'Test Title',
            'year': 2020,
            'track': {'no': 1, 'of': 1},
            'disk': {'no': 1, 'of': 1}
        }

        // Mock to resolve to expected data dictionary;
        // Using common field to correspond to the music-metadata library.
        // Added TS-Ignore to ignore other specifics of the metadata that are unused.
        // @ts-ignore
        spy.mockResolvedValue({ 'common': expectedDataDict })

        // Load the sound
        let path: string = 'test-path'
        let loadedSound = fileLoader.loadSound(path)

        // Assert that object data is defined
        expect(loadedSound.sound).toBeDefined()
        expect(loadedSound.metadata).toBeDefined()

        return loadedSound.metadata.then(data => {
            // Ensure that metadata is defined
            expect(data).toBeDefined()

            // Verify certain attributes of the data
            expect(data.title).toEqual(expectedDataDict.title)
            expect(data.year).toEqual(expectedDataDict.year)
        })
    })
})

/**
 * Non-existing file tests (direct integration tests)
 */
describe('Load sound non-existing file tests', () => {
    test('Load sound non-existing sound test', () => {
        expect.assertions(2)

        let path: string = 'test-path'
        let loadedSound = fileLoader.loadSound(path)

        // Assert that sound object is defined
        expect(loadedSound.sound).toBeDefined()

        return loadedSound.sound.then(data => {
            // Sound will still be defined due to the way Howler loads files.
            // Thus, we must handle this error higher up, and the sound
            // should still be defined.
            expect(data).toBeDefined()
        })
    })

    test('Load sound non-existing metadata test', () => {
        expect.assertions(1)
        let path: string = 'test-path'
        let loadedSound = fileLoader.loadSound(path)

        // Assert that metadata object is defined
        expect(loadedSound.metadata).toBeDefined()

        // Ensure empty dictionary is returned as the data
        // return loadedSound.metadata.then(data => {
        //     expect(data.artist).toEqual()
        // })
    })
})