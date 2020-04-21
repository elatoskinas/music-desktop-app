import * as LinkedList from 'yallist'
import {Song, Album} from '@music-data/music-data.ts'

export class SongQueue {
    private queue: LinkedList

    constructor() {
        // Create new, empty queue
        this.queue = LinkedList.create()
    }

    next() {
        return this.queue.shift()
    }

    addSong(song: Song) {
        this.queue.push(song)
    }

    addAlbum(album: Album) {
        album.songs.forEach((song) => this.addSong(song))
    }

    songCount() {
        return this.queue.length
    }
}