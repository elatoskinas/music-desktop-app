/**
  * Contains functionality for loading & returning music data in the form of an API.
*/

import * as metadata from 'music-metadata'
import * as fg from 'fast-glob'
import * as path from 'path'
import * as fs from 'fs'

import {Howl} from 'howler'
import {Song} from '@music-data/music-data.ts'
import {SUPPORTED_TYPES} from '@common/status.ts'
import {loadSound} from '@music-data/music-loader.ts'

// All supported extensions combined in a single CSV string
let supportedExtensionsCSV = SUPPORTED_TYPES.join(',')

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
// export function loadSound(path: string) {
//     // Create new sound from the specified path
//     let newSound = new Promise((resolve) => {
//         let sound = new Howl({
//             src: [path],
//             html5: true,
//         })

//         resolve(sound)
//     })

//     // Parse the metadata of the file
//     let meta = metadata.parseFile(path).then(
//         outputMetadata => {
//             return new Song(outputMetadata.common)
//         }
//     ).catch( err => {
//         console.error(err.message)
//         return new Song({})
//     })
    
//     return {
//         'sound': newSound,
//         'metadata': meta
//     }
// }

/**
 * Processes & loads sound files from the provided paths list.
 * The paths are normalized prior to processing them.
 *
 * The function is an async function, and thus returns a promise.
 * The promise returns a list of promises, each of which corresponds
 * to a single stream.
 * 
 * A callback function is passed in as a parammeter to be invoked after
 * a single file is read from the stream. The callback is expected to take a single
 * string parameter, corresponding to the full path of the audio.
 * 
 * @param paths List of full paths (as strings)
 * @param callback  Callback to invoke after processing a single file in a stream
 * @returns Promise that returns a list of promises (where each entry corresponds to
 *          a single stream)
 */
export async function processSoundFilePaths(paths: string[], callback: Function) {
    // Normalize all paths & convert any backward slashes to forward slashes
    // for consistency with fast-glob.
    const filePaths = paths.map(s => path.normalize(s).replace(/\\/g, '/'))
    const streamPromises = []

    for (const path of filePaths) {
        // Ensure path exists
        if (fs.existsSync(path)) {
            // Check whether the path points to a directory
            const isDir = fs.statSync(path).isDirectory()

            if (isDir) {
                // Get stream from path, and process it in async fashion
                const stream = getSoundFilesRecursively(path, supportedExtensionsCSV)
                const streamPromise = processStream(stream, callback)
                streamPromises.push(streamPromise)
            } else {
                // Send callback of file directly
                loadSound(path).then((sound) => {
                    callback(sound)
                })
            }
        }
    }

    return streamPromises
}

/**
 * Processes a single stream of audio files.
 * The expected data in the stream are full paths corresponding to
 * concrete audio files.
 * 
 * The function is async, therefore it returns a promise. The promise returns
 * nothing, but upon resolution, it indicates that the stream has finished
 * processing.
 * 
 * A callback function is passed in as a parameter to be invoked after a
 * single file is read from the stream.
 * 
 * @param stream  Stream of audio file paths (as strings)
 * @param callback Callback to invoke after processing a single file in the stream
 */
async function processStream(stream, callback: Function) {
    // Wait for entry to come from stream
    for await (const entry of stream) {        
        // Load sound and invoke callback
        loadSound(entry).then((sound) => {
            callback(sound)
        })
    }
}

/**
 * Recursively traverses the given path (that is expected to be a directory),
 * and retrieves a stream of audio files with the specified extensions.
 * 
 * @param path Path of the directory
 * @param extensions Extensions to look for as a CSV string
 * @returns Stream of files found in the form of a ReadableStream
 */
function getSoundFilesRecursively(path: string, extensions: string) {
    // Construct path pattern with supported types
    let pathPattern = path + `/**/*.{${extensions}}`

    // Return stream of the path pattern
    return fg.stream(pathPattern)
}