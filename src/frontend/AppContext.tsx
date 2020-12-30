import { Song } from '@data/music-data'
import { SongQueue } from '@data/song-queue'
import * as React from 'react'

export interface AppContextState {
    activeSong: Song
    queuedSongs: Song[]
    queueSong: (song: Song) => void
    changeSong: (song: Song) => void
    nextSong: () => void
    previousSong: () => void
}

export const AppContext = React.createContext<AppContextState>(null)

export const AppContextConsumer = AppContext.Consumer

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

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        )
    }
}
