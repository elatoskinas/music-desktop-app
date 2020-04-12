export let OPEN_FILE_SELECTION = {
    name: 'openFileSelection',
    data: (useFolders: boolean) => {return {
        useFolders: useFolders
    }}
}

export let LOADED_FILE = {
    name: 'loadedFile',
    data: (filePath: string) => {return {
        filePath: filePath
    }}
}

export let LOAD_FILES_FROM_PATHS = {
    name: 'loadFilesFromPaths',
    data: (paths: string[]) => {return {
        paths
    }}
}