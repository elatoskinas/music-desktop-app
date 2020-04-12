import * as fileLoader from '@music-data/file-loader.ts'
import * as metadata from 'music-metadata'
import {mocked} from 'ts-jest/utils'
import { Stream } from 'stream'

jest.mock('fast-glob')
jest.mock('fs')

import * as fg from 'fast-glob'
import * as fs from 'fs'

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

/**
 * Tests for sound file processing functionality
 */
describe('Sound file processing tests', () => {
    let callback = jest.fn()

    beforeEach(() => {
        // Re-create callback on each call
        callback = jest.fn()
    })

    test('Process empty sound file paths', async () => {
        const paths = []

        // Process no paths; The test will suceed if no crashes occur
        let streams = await fileLoader.processSoundFilePaths(paths, callback)

        // Assert that callback is never invoked
        expect(callback).toHaveBeenCalledTimes(0)
        expect(streams).toEqual([])
    })

    describe('Non-existing single path tests', () => {
        beforeEach(() => {
            // Let the path not exist via fs check
            mocked(fs).existsSync.mockReturnValue(false)
        })

        test('Process single file path does not exist', async () => {
            const paths = ['/some/path/not/exists']
    
            let streams = await fileLoader.processSoundFilePaths(paths, callback)
    
            // Callback should never be invoked if the path does not exist
            expect(callback).toHaveBeenCalledTimes(0)
            expect(streams).toEqual([])
        })
    
        test('Path formatting with backslashes', async () => {
            const paths = ['path\\with\\backslash']
    
            let streams = await fileLoader.processSoundFilePaths(paths, callback)
    
            // Assert that the directory check was called with a forward-slash path
            expect(fs.existsSync).toBeCalledWith('path/with/backslash')
            expect(streams).toEqual([])
        })
    
        test('Path formatting inconsistent', async () => {
            const paths = ['path/with\\some\\minor/inconsistencies']
    
            let streams = await fileLoader.processSoundFilePaths(paths, callback)
    
            // Assert that the directory check was called with a forward-slash path
            expect(fs.existsSync).toBeCalledWith('path/with/some/minor/inconsistencies')
            expect(streams).toEqual([])
        })
    })

    describe('Non-directory path tests', () => {
        beforeEach(() => {
            // Let every path exist via fs check
            mocked(fs).existsSync.mockReturnValue(true)

            // Create expected stats object, setting the isDirectory check to resolve to false
            const expectedStats = new fs.Stats()
            expectedStats.isDirectory = () => false

            // Make statSync return the directory object set to false
            mocked(fs).statSync.mockReturnValue(expectedStats)
        })

        test('Process existing file not directory', async () => {
            const paths = ['/path/to/file.mp3']
    
            let streams = await fileLoader.processSoundFilePaths(paths, callback)
    
            // Assert callback invoked with direct path
            expect(callback).toHaveBeenCalledTimes(1)
            expect(callback).toHaveBeenCalledWith(paths[0])
            expect(streams).toEqual([])
        })
    
        test('Process existing files not directories multiple', async () => {
            const paths = ['/path/to/file1.mp3', '/path/to/file2.mp3', '/path/to/file3.mp3']
    
            let streams = await fileLoader.processSoundFilePaths(paths, callback)
    
            // Assert callback invoked with direct path
            expect(callback).toHaveBeenCalledTimes(3)
            expect(callback).toHaveBeenCalledWith(paths[0])
            expect(callback).toHaveBeenCalledWith(paths[1])
            expect(callback).toHaveBeenCalledWith(paths[2])
            expect(streams).toEqual([])
        })
    })

    describe('Directory stream tests', () => {
        let dirStream = new Stream.Readable()

        beforeEach(() => {
            // Let every path exist via fs check
            mocked(fs).existsSync.mockReturnValue(true)

            // Create expected stats object, setting the isDirectory check to resolve to false
            const expectedStats = new fs.Stats()
            expectedStats.isDirectory = () => true
            
            // Make statSync return the directory object set to false
            mocked(fs).statSync.mockReturnValue(expectedStats)

            // Re-create stream
            dirStream = new Stream.Readable({ objectMode: true })

            // Make fast-glob return the created stream
            mocked(fg.stream).mockReturnValue(dirStream)
        })

        test('Process single path empty stream', async () => {
            expect.assertions(2)
            const paths = ['/path/to/music']

            dirStream.push(null)
    
            let streams = await fileLoader.processSoundFilePaths(paths, callback)
            expect(streams.length).toEqual(1)

            return Promise.all(streams).then(() => {
                // Assert that no callbacks are made
                expect(callback).toHaveBeenCalledTimes(0)
            })
        })

        test('Process single path single file stream', async () => {
            expect.assertions(3)

            const paths = ['/path/to/music']
    
            dirStream.push('/path/to/music/file.mp3')
            dirStream.push(null)

            let streams = await fileLoader.processSoundFilePaths(paths, callback)
            expect(streams.length).toEqual(1)

            return Promise.all(streams).then(() => {
                // Assert that a single callback is made
                expect(callback).toHaveBeenCalledTimes(1)
                expect(callback).toHaveBeenCalledWith('/path/to/music/file.mp3')
            })
        })

        test('Process single path multi files stream', async () => {
            expect.assertions(5)

            const paths = ['/path/to/music']
    
            dirStream.push('/path/to/music/file1.mp3')
            dirStream.push('/path/to/music/file2.mp3')
            dirStream.push('/path/to/music/file3.mp3')
            dirStream.push(null)

            let streams = await fileLoader.processSoundFilePaths(paths, callback)
            expect(streams.length).toEqual(1)

            return Promise.all(streams).then(() => {
                // Assert that a single callback is made
                expect(callback).toHaveBeenCalledTimes(3)
                expect(callback).toHaveBeenCalledWith('/path/to/music/file1.mp3')
                expect(callback).toHaveBeenCalledWith('/path/to/music/file2.mp3')
                expect(callback).toHaveBeenCalledWith('/path/to/music/file3.mp3')
            })
        })

        // TODO: Multi-stream tests
    })
})