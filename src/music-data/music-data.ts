/**
 * File for keeping music data containing classes.
 */

import { IPicture } from 'music-metadata'

/**
 * Metadata Classes
 */

/**
 * Class to represent the data of a generic Music Entry;
 * Contains common data for music entries (songs & albums)
 */
abstract class MusicEntryData {
    title: string
    year: number
    duration: number
    genres: string[]
    covers: IPicture[]
}

/**
 * Class to represent the data of a Song.
 * Contains all the necessary song information,
 * as well as the album that the song is linked to.
 */
class SongData extends MusicEntryData {
    artists: string[] = []

    album: AlbumData
    track: number
    disk: number

    rating: number
}

/**
 * Class to represent the data of an Album.
 * Contains all the necessary album information,
 * but does not contain the information of each concrete song.
 * TODO: Add individual song data as well?
 */
class AlbumData extends MusicEntryData {
    artist: string
    totalTracks: number
    totalDisks: number
}

/**
 * Music Entry classes
 */

/**
 * Generic Music Entry class definition
 */
class MusicEntry<D extends MusicEntryData> {
    data: D
}

/**
 * Class corresponding to a song, containing the concrete
 * sound object, as well as the song data.
 * 
 * TODO: Rename to Song after migrating from original Song
 */
class Song_ extends MusicEntry<SongData> {
    sound: Howl
}

/**
 * Class corresponding to an album, containing a list of
 * songs that the album contains in order, as well as the
 * album data.
 */
class Album extends MusicEntry<AlbumData> {
    songs: Song[]
}

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