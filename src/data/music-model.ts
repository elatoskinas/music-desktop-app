/** Song table data model */
export interface SongModel {
    id: number
    path: string
    title: string
    year: number
    track: number
    disk: number
    duration: number
    rating: number
    albumId: number
}

/** Album table data model */
export interface AlbumModel {
    id: number
    title: string
    year: number
    total_tracks: number
    total_disks: number
    rating: number
}

/** Genre table data model */
export interface GenreModel {
    name: string
}

/** Artist table data model */
export interface ArtistModel {
    name: string
}

/** Song to genre data model (many-to-many relation) */
export interface SongGenreModel {
    song_id: number
    genre: string
}

/** Album to genre data model (many-to-many relation) */
export interface AlbumGenreModel {
    album_id: number
    genre: string
}

/** Song to artist data model (many-to-many relation) */
export interface SongArtistModel {
    song_id: number
    artist_name: string
}

/** Album to artist data model (many-to-many relation) */
export interface AlbumArtistModel {
    album_id: number
    artist_name: string
}
