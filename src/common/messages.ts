import { Song } from '@music-data/music-data.ts'

export let OPEN_FILE_SELECTION = {
    name: 'openFileSelection',
    data: (useFolders: boolean) => {return {
        useFolders: useFolders
    }}
}

export let LOADED_FILE = {
    name: 'loadedFile',
    data: (sound: Song) => {return {
        sound
    }}
}