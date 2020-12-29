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

export interface AlbumModel {
    id: number
    title: string
    year: number
    total_tracks: number
    total_disks: number
    rating: number
}

export interface GenreModel {
    name: string
}

export interface ArtistModel {
    name: string
}

export interface SongGenreModel {
    song_id: number
    genre: string
}

export interface AlbumGenreModel {
    album_id: number
    genre: string
}

export interface SongArtistModel {
    song_id: number
    artist_name: string
}

export interface AlbumArtistModel {
    album_id: number
    artist_name: string
}
