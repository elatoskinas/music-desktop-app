import { Song } from '@data/music-data'

export const OPEN_FILE_SELECTION = {
    name: 'openFileSelection',
    data: () => {
        return {}
    },
}

export const RETURN_FILE_SELECTION = {
    name: 'returnFileSelection',
    data: (folders: string[]) => {
        return {
            folders,
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

export const GET_PREFERENCES = {
    name: 'getPreferences',
    data: (key: string) => {
        return {
            key,
        }
    },
}

export const RETURN_PREFERENCES = {
    name: 'returnPreferences',
    data: (value: string | null) => {
        return {
            value,
        }
    },
}

export const STORE_PREFERENCES = {
    name: 'storePreferences',
    data: (key: string, value: string) => {
        return {
            key,
            value,
        }
    },
}
