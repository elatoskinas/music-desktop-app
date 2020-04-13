/**
 * File for keeping music data containing classes.
 */

import { IRating } from 'music-metadata/lib/type'
import { IPicture } from 'music-metadata'

/**
 * Metadata Classes
 */

/**
 * Class to represent the data of a generic Music Entry;
 * Contains common data for music entries (songs & albums)
 */
export abstract class MusicEntryData {
    title: string
    year: number
    duration: number
    genres: string[]
    covers: IPicture[]

    constructor() {
        this.genres = []
        this.covers = []
    }

    setTitle(title: string) {
        this.title = title
        return this
    }

    setYear(year: number) {
        this.year = year
        return this
    }

    setDuration(duration: number) {
        this.duration = duration
        return this
    }

    setGenres(genres: string[]) {
        this.genres = genres
        return this
    }

    setCovers(covers: IPicture[]) {
        this.covers = covers
        return this
    }
}

/**
 * Class to represent the data of a Song.
 * Contains all the necessary song information,
 * as well as the album that the song is linked to.
 */
export class SongData extends MusicEntryData {
    artists: string[]

    album: AlbumData
    track: number
    disk: number

    ratings: IRating[]

    constructor() {
        super()

        this.title = 'Unknown Song'
        this.artists = []
        this.ratings = []
    }

    setArtists(artists: string[]) {
        this.artists = artists
        return this
    }

    setAlbum(album: AlbumData) {
        this.album = album
        return this
    }

    setTrack(track: number) {
        this.track = track
        return this
    }

    setDisk(disk: number) {
        this.disk = disk
        return this
    }

    setRating(ratings: IRating[]) {
        this.ratings = ratings
        return this
    }
}

/**
 * Class to represent the data of an Album.
 * Contains all the necessary album information,
 * but does not contain the information of each concrete song.
 * TODO: Add individual song data as well?
 */
export class AlbumData extends MusicEntryData {
    artist: string
    totalTracks: number
    totalDisks: number

    constructor() {
        super()

        this.title = 'Unknown Song'
        this.artist = 'Unknown artist'
    }

    setArtist(artist: string) {
        this.artist = artist
        return this
    }

    setTotalTracks(totalTracks: number) {
        this.totalTracks = totalTracks
        return this
    }

    setTotalDisks(totalDisks: number) {
        this.totalDisks = totalDisks
        return this
    }
}

/**
 * Music Entry classes
 */

/**
 * Generic Music Entry class definition
 */
export class MusicEntry<D extends MusicEntryData> {
    data: D

    constructor(data: D) {
        this.data = data
    }
}

/**
 * Class corresponding to a song, containing the concrete
 * sound object, as well as the song data.
 * 
 * TODO: Rename to Song after migrating from original Song
 */
export class Song extends MusicEntry<SongData> {
    path: string

    constructor(data: SongData, path: string) {
        super(data)
        this.path = path
    }
}

/**
 * Class corresponding to an album, containing a list of
 * songs that the album contains in order, as well as the
 * album data.
 */
export class Album extends MusicEntry<AlbumData> {
    songs: Song[]

    constructor(data: AlbumData) {
        super(data)
        this.songs = []
    }
}

/**
 * Container for a single song, containing all the neccessary metadata info.
 * 
 * TODO: Restructure/rethink this in terms of class structure.
 */
// export class Song {
//     artist: string;
//     album: string;
//     title: string;
//     genre: string;
//     tracknumber: number;
//     year: number;

//     covers: IPicture[];

//     constructor(metadata) {
//         // TODO: Generalize this
//         this.artist = metadata.artist ? metadata.artist : 'Unknown Artist'
//         this.album = metadata.album ? metadata.album : 'Unknown Album'
//         this.title = metadata.title ? metadata.title : 'Unknown Title'
//         this.genre = metadata.genre ? metadata.genre : 'Unknown Genre'
//         this.tracknumber = metadata.track ? metadata.track : 1
//         this.year = metadata.year ? metadata.year : 'Unknown Year'
//         this.covers = metadata.picture ? metadata.picture : []
//     }
// }