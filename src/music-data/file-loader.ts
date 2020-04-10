/**
  * Contains functionality for loading & returning music data in the form of an API.
*/

import {Howl} from 'howler'
import * as metadata from 'music-metadata'
import {Song} from '@music-data/music-data.ts'

/**
 * Loads a sound from the specified path, and returns an object
 * that contains both the sound and the metadata as a promise.
 * 
 * The returned promise object's sound can be accesed by the 'sound' field,
 * while the metadata can be accessed by the 'metadata' field.
 * 
 * @param path Path to read sound from
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