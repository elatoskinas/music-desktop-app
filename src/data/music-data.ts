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
export abstract class MusicEntryData {
    title: string
    artists: string[]
    year: number
    duration: number
    rating: number
    genres: string[]
    covers: IPicture[]

    /**
     * Create a new Music Entry Data instance.
     */
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

    setArtists(artists: string[]) {
        this.artists = artists
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

    setRating(rating: number) {
        this.rating = rating
        return this
    }
}

/**
 * Class to represent the data of a Song.
 * Contains all the necessary song information,
 * as well as the album that the song is linked to.
 */
export class SongData extends MusicEntryData {
    album: AlbumData
    track: number
    disk: number

    /**
     * Create a new Song Data instance.
     */
    constructor() {
        super()

        this.artists = []
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
}

/**
 * Class to represent the data of an Album.
 * Contains all the necessary album information,
 * but does not contain the information of each concrete song.
 */
export class AlbumData extends MusicEntryData {
    totalTracks: number
    totalDisks: number

    /**
     * Create new Album Data instance.
     */
    constructor() {
        super()
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

    /**
     * Create a new MusicEntry instance holding the specified corresponding
     * data.
     *
     * @param data  Data of the MusicEntry
     */
    constructor(data: D) {
        this.data = data
    }
}

/**
 * Class corresponding to a song, containing the concrete
 * sound object, as well as the song data.
 */
export class Song extends MusicEntry<SongData> {
    path: string

    /**
     * Create a new Song instancce with the specified
     * song data and the path of the song.
     *
     * @param data  SongData object
     * @param path  Full path of song
     */
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

    /**
     * Create a new Album instance with the specified album data.
     *
     * @param data  AlbumData object
     */
    constructor(data: AlbumData) {
        super(data)
        this.songs = []
    }

    /**
     * Adds a song to the album, also updating any relevant
     * data for the album.
     *
     * TODO: Prevent song duplication
     * TODO: Update AlbumData
     *
     * @param song Song to add to the album
     */
    addSong(song: Song) {
        this.songs.push(song)
    }
}
