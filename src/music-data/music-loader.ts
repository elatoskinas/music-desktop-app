import * as metadata from 'music-metadata'
import { Song, SongData, AlbumData } from '@music-data/music-data.ts'

export function loadSound(path: string) {
    // Parse the metadata of the file
    return metadata.parseFile(path, {
        duration: true
    }).then(
        outputMetadata => {
            return new Song(createSongData(outputMetadata), path)
        }
    ).catch( err => {
        console.error(err.message)
        return new Song(new SongData(), path)
    })
}

function createSongData(metadata: metadata.IAudioMetadata) {
    let commonMeta = metadata.common
    let songData = new SongData()

    songData.setTitle(commonMeta.title)
        .setYear(commonMeta.year)
        .setGenres(commonMeta.genre)
        .setCovers(commonMeta.picture)
        .setArtists(commonMeta.artists)
        .setTrack(commonMeta.track.no)
        .setDisk(commonMeta.disk.no)
        .setRating(commonMeta.rating)
        .setDuration(metadata.format.duration)
    
    // TODO: Update album for all songs in album
    let albumData = new AlbumData()

    albumData.setTitle(commonMeta.album)
        .setArtist(commonMeta.albumartist)
        .setTotalTracks(commonMeta.track.of)
        .setTotalDisks(commonMeta.disk.of)

    songData.setAlbum(albumData)

    return songData
}