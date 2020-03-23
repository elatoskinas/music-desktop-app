/**
 * File for keeping music data related functionality.
 * Contains functionality for loading & returning music data in the form of an API,
 * and contains containers for music data.
 */

const {Howl} = require('howler')
const metadata = require('music-metadata')


// TODO: Restructure/rethink this in terms of class structure.
export class Song {
    artist: string;
    album: string;
    title: string;
    genre: string;
    tracknumber: number;
    year: number;

    constructor(metadata) {
        // TODO: Generalize this
        this.artist = metadata.artist ? metadata.artist : "Unknown Artist"
        this.album = metadata.album ? metadata.album : "Unknown Album"
        this.title = metadata.title ? metadata.title : "Unknown Title"
        this.genre = metadata.genre ? metadata.genre : "Unknown Genre"
        this.tracknumber = metadata.track ? metadata.track : 1
        this.year = metadata.year ? metadata.year : "Unknown Year"
    }
}

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
    });

    // Parse the metadata of the file
    let meta = metadata.parseFile(path).then(
        outputMetadata => {
            return outputMetadata;
        }
    ).catch( err => {
        console.error(err.message)
    });
    
    return {
        'sound': newSound,
        'metadata': meta
    }
}