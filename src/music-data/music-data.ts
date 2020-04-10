/**
 * File for keeping music data containing classes.
 */

import { IPicture } from 'music-metadata'


/**
 * Container for a single song, containing all the neccessary metadata info.
 * 
 * TODO: Restructure/rethink this in terms of class structure.
 */
export class Song {
    artist: string;
    album: string;
    title: string;
    genre: string;
    tracknumber: number;
    year: number;

    covers: IPicture[];

    constructor(metadata) {
        // TODO: Generalize this
        this.artist = metadata.artist ? metadata.artist : 'Unknown Artist'
        this.album = metadata.album ? metadata.album : 'Unknown Album'
        this.title = metadata.title ? metadata.title : 'Unknown Title'
        this.genre = metadata.genre ? metadata.genre : 'Unknown Genre'
        this.tracknumber = metadata.track ? metadata.track : 1
        this.year = metadata.year ? metadata.year : 'Unknown Year'
        this.covers = metadata.picture ? metadata.picture : []
    }
}