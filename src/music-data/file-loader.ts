/**
  * Contains functionality for loading & returning music data in the form of an API.
*/

const {Howl} = require('howler')
const metadata = require('music-metadata')
const {Song} = require('@music-data/music-data.ts')

/**
 * Loads a sound from the specified path, and returns an object
 * that contains both the sound and the metadata as a promise.
 * 
 * The returned promise object's sound can be accesed by the 'sound' field,
 * while the metadata can be accessed by the 'metadata' field.
 * 
 * TODO: Convert to async/promise?
 * 
 * @param path Path to read sound from
 */
export function loadSound(path: string) {
    // Create new sound from the specified path
    let newSound = new Howl({
        src: [path],
        html5: true,
    })

    // Parse the metadata of the file
    let meta = metadata.parseFile(path).then(
        outputMetadata => {
            return new Song(outputMetadata.common);
        }
    ).catch( err => {
        console.error(err.message)
    })
    
    return {
        'sound': newSound,
        'metadata': meta
    }
}