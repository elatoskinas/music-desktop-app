import { Song } from '@data/music-data'
import { SongQueue } from '@data/song-queue'
import * as React from 'react'
import { ipcRenderer as ipc } from 'electron'
import {
    GET_PREFERENCES,
    RETURN_PREFERENCES,
    STORE_PREFERENCES,
} from '@common/messages'

/** Shared App Context state */
export interface AppContextState {
    /** Song that is currently selected to be played */
    activeSong: Song

    /** Songs that are in the playing queue */
    queuedSongs: Song[]

    /** Queues a song */
    queueSong: (song: Song) => void

    /** Changes the song to the specified */
    changeSong: (song: Song) => void

    /** Changes song to next in queue */
    nextSong: () => void

    /** Changes song to previous in queue */
    previousSong: () => void

    /** Stores value into the specified key for preferences */
    storePreference: (key: string, value: string) => void

    /** Gets the value of the specified key in preferences */
    getPreference: (key: string) => Promise<string | null>
}

export const AppContext = React.createContext<AppContextState>(null)
export const AppContextConsumer = AppContext.Consumer

/**
 * App Context Provider component that provides AppContext to the
 * children of the component.
 */
export class AppContextProvider extends React.Component<{}, AppContextState> {
    queue: SongQueue

    constructor(props) {
        super(props)

        this.queue = new SongQueue()

        this.state = {
            activeSong: this.queue.current(),
            queuedSongs: this.queue.getAllSongs(),
            queueSong: this.queueSong,
            changeSong: this.changeSong,
            nextSong: this.nextSong,
            previousSong: this.previousSong,
            storePreference: this.storePreference,
            getPreference: this.getPreference,
        }
    }

    queueSong = (song: Song) => {
        this.queue.addSong(song)

        this.setState({
            activeSong: this.queue.current(),
            queuedSongs: this.queue.getAllSongs(),
        })
    }

    changeSong = (song: Song) => {
        this.queue.changeSong(song)

        this.setState({
            activeSong: this.queue.current(),
        })
    }

    nextSong = () => {
        const nextSong = this.queue.next()

        this.setState({
            activeSong: nextSong,
        })
    }

    previousSong = () => {
        const prevSong = this.queue.previous()

        this.setState({
            activeSong: prevSong,
        })
    }

    storePreference = (key: string, value: string) => {
        ipc.send(STORE_PREFERENCES.name, STORE_PREFERENCES.data(key, value))
    }

    getPreference = (key: string): Promise<string | null> => {
        return new Promise((resolve) => {
            ipc.send(GET_PREFERENCES.name, GET_PREFERENCES.data(key))

            ipc.on(RETURN_PREFERENCES.name, (e, data) => {
                resolve(data.value)
            })
        })
    }

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}
