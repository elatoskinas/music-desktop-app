import * as fileLoader from '@backend/file-loader'
import { Song, SongData } from '@data/music-data'

import { mocked } from 'ts-jest/utils'
import { Stream } from 'stream'

jest.mock('fast-glob')
jest.mock('fs')
jest.mock('@backend/music-loader.ts')

import * as fg from 'fast-glob'
import * as fs from 'fs'

import { loadSoundData } from '@backend/music-loader'

afterEach(() => {
    // Restore all mocks after finishing with a test
    jest.restoreAllMocks()
})

/**
 * Tests for sound file processing functionality
 */
describe('Sound file processing tests', () => {
    let callback = jest.fn()

    beforeEach(() => {
        // Re-create callback on each call
        callback = jest.fn()
        mocked(loadSoundData).mockResolvedValue(
            new Song(new SongData(), 'path')
        )
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

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )

            // Callback should never be invoked if the path does not exist
            expect(callback).toHaveBeenCalledTimes(0)
            expect(streams).toEqual([])
        })

        test('Path formatting with backslashes', async () => {
            const paths = ['path\\with\\backslash']

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )

            // Assert that the directory check was called with a forward-slash path
            expect(fs.existsSync).toBeCalledWith('path/with/backslash')
            expect(streams).toEqual([])
        })

        test('Path formatting inconsistent', async () => {
            const paths = ['path/with\\some\\minor/inconsistencies']

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )

            // Assert that the directory check was called with a forward-slash path
            expect(fs.existsSync).toBeCalledWith(
                'path/with/some/minor/inconsistencies'
            )
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

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )

            // Assert callback invoked with direct path
            expect(callback).toHaveBeenCalledTimes(1)
            expect(loadSoundData).toHaveBeenCalledWith(paths[0])

            expect(streams).toEqual([])
        })

        test('Process existing files not directories multiple', async () => {
            const paths = [
                '/path/to/file1.mp3',
                '/path/to/file2.mp3',
                '/path/to/file3.mp3',
            ]

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )

            // Assert callback invoked with direct path
            expect(callback).toHaveBeenCalledTimes(3)
            expect(loadSoundData).toHaveBeenCalledWith(paths[0])
            expect(loadSoundData).toHaveBeenCalledWith(paths[1])
            expect(loadSoundData).toHaveBeenCalledWith(paths[2])
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

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )
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

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )
            expect(streams.length).toEqual(1)

            return Promise.all(streams).then(() => {
                // Assert that a single callback is made
                expect(callback).toHaveBeenCalledTimes(1)
                expect(loadSoundData).toHaveBeenCalledWith(
                    '/path/to/music/file.mp3'
                )
            })
        })

        test('Process single path multi files stream', async () => {
            expect.assertions(5)

            const paths = ['/path/to/music']

            dirStream.push('/path/to/music/file1.mp3')
            dirStream.push('/path/to/music/file2.mp3')
            dirStream.push('/path/to/music/file3.mp3')
            dirStream.push(null)

            let streams = await fileLoader.processSoundFilePaths(
                paths,
                callback
            )
            expect(streams.length).toEqual(1)

            return Promise.all(streams).then(() => {
                // Assert that a single callback is made
                expect(callback).toHaveBeenCalledTimes(3)
                expect(loadSoundData).toHaveBeenCalledWith(
                    '/path/to/music/file1.mp3'
                )
                expect(loadSoundData).toHaveBeenCalledWith(
                    '/path/to/music/file2.mp3'
                )
                expect(loadSoundData).toHaveBeenCalledWith(
                    '/path/to/music/file3.mp3'
                )
            })
        })

        // TODO: Multi-stream tests
    })
})
