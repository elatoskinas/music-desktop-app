import { Song } from '@data/music-data'

export const OPEN_FILE_SELECTION = {
    name: 'openFileSelection',
    data: (useFolders: boolean) => {
        return {
            useFolders: useFolders,
        }
    },
}

export const LOADED_SOUND = {
    name: 'loadedSound',
    data: (sound: Song) => {
        return {
            sound,
        }
    },
}

export const GET_SONGS = {
    name: 'getSongs',
    data: () => {
        return {}
    },
}

export const RETURN_SONGS = {
    name: 'returnSongs',
    data: (songs: Song[]) => {
        return {
            songs,
        }
    },
}
