/**
  * Contains functionality for loading & returning music data in the form of an API.
*/

import {Howl} from 'howler'
import * as metadata from 'music-metadata'
import {Song} from '@music-data/music-data.ts'
import * as fg from 'fast-glob'
import {SUPPORTED_TYPES} from '@common/status.ts'
import * as path from 'path'

// All supported types combined in a single CSV string
let supportedTypesCSV = SUPPORTED_TYPES.join(',')

/**
 * Loads a sound from the specified path, and returns an object
 * that contains both the sound and the metadata as a promise.
 * 
 * The returned promise object's sound can be accesed by the 'sound' field,
 * while the metadata can be accessed by the 'metadata' field.
 * 
 * @param path Path to read sound from
 * @returns Sound data object: Dictionary containing 'sound' and 'metadata' entries
 *          as promises for the actual Sound & Metadata objects.
 */
export function loadSound(path: string) {
    // Create new sound from the specified path
    let newSound = new Promise((resolve) => {
        let sound = new Howl({
            src: [path],
            html5: true,
        })

        resolve(sound)
    })

    // Parse the metadata of the file
    let meta = metadata.parseFile(path).then(
        outputMetadata => {
            return new Song(outputMetadata.common)
        }
    ).catch( err => {
        console.error(err.message)
        return new Song({})
    })
    
    return {
        'sound': newSound,
        'metadata': meta
    }
}

/**
 * Processes & loads sound files from the provided paths list.
 * The paths are normalized prior to processing them.
 * 
 * @param paths List of full paths (as strings)
 */
export async function processSoundFilePaths(paths: string[], callback: Function) {
    // TODO: Support non-directory paths?

    // Normalize all paths & convert any backward slashes to forward slashes
    // for consistency with fast-glob.
    const filePaths = paths.map(s => path.normalize(s).replace(/\\/g, '/'))

    for (const path of filePaths) {
        // console.log(`Path: ${path}`)

        // Get stream from path, and process it in async fashion
        const stream = getSoundFilesRecursively(path)
        processStream(stream, callback)
    }
}

/**
 * Processes a single stream of audio files.
 * The expected data in the stream are full paths corresponding to
 * concrete audio files.
 * 
 * @param stream  Stream of audio file paths (as strings)
 */
async function processStream(stream, callback: Function) {
    // Wait for entry to come from stream
    for await (const entry of stream) {
        callback(entry)
    }
}

/**
 * Recursively traverses the given path (that is expected to be a directory),
 * and retrieves a stream of audio files with supported extensions.
 * 
 * @param path Path of the directory
 * @returns Stream of files found in the form of a ReadableStream
 */
function getSoundFilesRecursively(path: string) {
    // Construct path pattern with supported types
    let pathPattern = path + `/**/*.{${supportedTypesCSV}}`

    // Return stream of the path pattern
    return fg.stream(pathPattern)
}