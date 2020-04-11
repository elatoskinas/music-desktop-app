/**
  * Contains functionality for loading & returning music data in the form of an API.
*/

import {Howl} from 'howler'
import * as metadata from 'music-metadata'
import {Song} from '@music-data/music-data.ts'
import * as fg from 'fast-glob'
import {SUPPORTED_TYPES} from '@common/status.ts'

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
 * Recursively traverses the given path (that is expected to be a directory),
 * and retrieves a stream of audio files with supported extensions.
 * 
 * @param path Path of the directory
 * @returns Stream of files found in the form of a ReadableStream
 */
export function getSoundFilesRecursively(path: string) {
    // Construct path pattern with supported types
    let pathPattern = path + `/**/*.{${supportedTypesCSV}}`

    // Return stream of the path pattern
    return fg.stream(pathPattern)
}