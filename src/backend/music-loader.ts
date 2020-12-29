import * as metadataReader from 'music-metadata'
import { Song, Album } from '@data/music-data'
import { splitArtists } from '@common/format-utils'

/**
 * Loads sound data from the specified file path.
 * If the sound data cannot be loaded, a default SongData
 * object is constructed.
 *
 * The function returns a promise that resolves to a Song object,
 * which contains the 'data' property corresponding to the Song's
 * metadata (which is a SongData object)
 *
 * @param path  path to load Sound Data from
 * @returns Promise resolving to a Song object instance
 */
export function loadSoundData(path: string) {
    // Parse the metadata of the file
    return metadataReader
        .parseFile(path, {
            duration: true,
        })
        .then((outputMetadata) => {
            return createSong(path, outputMetadata)
        })
        .catch((err) => {
            console.error(err.message)
            return new Song().setPath(path)
        })
}

/**
 * Creates & returns a Song Data object from the specified metadata
 *
 * @param metadata  Song metadata
 * @returns new Song Data instance corresponding to the metadata provided
 */
function createSong(path: string, metadata: metadataReader.IAudioMetadata) {
    let commonMeta = metadata.common
    let song = new Song().setPath(path)

    song.setTitle(commonMeta.title)
        .setYear(commonMeta.year)
        .setGenres(commonMeta.genre || [])
        .setCovers(commonMeta.picture)
        .setArtists(commonMeta.artists || [])
        .setTrack(commonMeta.track.no)
        .setDisk(commonMeta.disk.no)
        .setRating(
            // TODO: This way of converting may not be applicable. Might require changing
            commonMeta.rating?.length > 0
                ? metadataReader.ratingToStars(commonMeta.rating[0].rating)
                : 0
        )
        .setDuration(metadata.format.duration)

    let album = new Album()

    album
        .setTitle(commonMeta.album)
        .setArtists(splitArtists(commonMeta.albumartist))
        .setGenres(song.genres)
        .setTotalTracks(commonMeta.track.of)
        .setTotalDisks(commonMeta.disk.of)

    song.setAlbum(album)

    return song
}
