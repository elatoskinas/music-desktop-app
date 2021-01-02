/**
 * File for keeping music data containing classes.
 */

import { IPicture } from 'music-metadata'
import { IntLike } from 'integer'
import { AlbumModel, SongModel } from './music-model'

/**
 * Class to represent the data of a generic Music Entry;
 * Contains common data for music entries (songs & albums)
 */
export abstract class MusicData {
    id: IntLike
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
        this.artists = []
        this.covers = []
    }

    setId(id: IntLike) {
        this.id = id
        return this
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
export class Song extends MusicData {
    album: Album
    track: number
    disk: number
    path: string

    /**
     * Create a new Song Data instance.
     */
    constructor() {
        super()

        this.artists = []
        this.album = new Album()
    }

    /**
     * Creates a Song instance from a SongModel data object.
     *
     * @param data SongModel to create Song from
     */
    static create(data: SongModel) {
        return new Song()
            .setDisk(data.disk)
            .setDuration(data.duration)
            .setId(data.id)
            .setPath(data.path)
            .setRating(data.rating)
            .setTitle(data.title)
            .setTrack(data.track)
            .setYear(data.year)
    }

    setAlbum(album: Album) {
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

    setPath(path: string) {
        this.path = path
        return this
    }
}

/**
 * Class to represent the data of an Album.
 * Contains all the necessary album information,
 * but does not contain the information of each concrete song.
 */
export class Album extends MusicData {
    totalTracks: number
    totalDisks: number
    songs: Song[]

    /**
     * Create new Album Data instance.
     */
    constructor() {
        super()
    }

    /**
     * Creates an Album instance from an AlbumModel data object.
     *
     * @param data AlbumModel to create Album from
     */
    static create(data: AlbumModel) {
        return new Album()
            .setId(data.id)
            .setRating(data.rating)
            .setTitle(data.title)
            .setTotalDisks(data.total_disks)
            .setTotalTracks(data.total_tracks)
            .setYear(data.year)
    }

    setTotalTracks(totalTracks: number) {
        this.totalTracks = totalTracks
        return this
    }

    setTotalDisks(totalDisks: number) {
        this.totalDisks = totalDisks
        return this
    }

    setSongs(songs: Song[]) {
        this.songs = songs
        return this
    }
}
