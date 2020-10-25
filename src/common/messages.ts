import { Song } from '@data/music-data'

export let OPEN_FILE_SELECTION = {
    name: 'openFileSelection',
    data: (useFolders: boolean) => {return {
        useFolders: useFolders
    }}
}

export let LOADED_SOUND = {
    name: 'loadedSound',
    data: (sound: Song) => {return {
        sound
    }}
}