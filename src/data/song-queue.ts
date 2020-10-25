import * as LinkedList from 'yallist'
import {Song, Album} from '@data/music-data'

/**
 * Song Queue abstract data type holding a structure to maintain
 * a list of songs and a pointer to the current song
 */
export class SongQueue {
    private queue: LinkedList
    private currentSong: LinkedList.Node

    /**
     * Creates a new empty song queue
     */
    constructor() {
        // Create new, empty queue
        this.queue = LinkedList.create()
    }

    /**
     * Gets the current position of the queue as the song in the queue.
     * 
     * @returns  Song at which the queue currently points to
     */
    getCurrentSong() {
        return this.currentSong
    }

    /**
     * Moves the position of the queue to the next song in the queue.
     * If the current song is the last song in the queue, the position
     * is reset to the first song in the queue.
     * 
     * @returns  Next song in queue. Can be undefined.
     */
    next() {
        if (this.currentSong !== undefined) {
            // Shift to next song & return it
            this.currentSong = this.currentSong.next

            // Wrap song to head if reached end
            if  (this.currentSong == undefined) {
                this.currentSong = this.queue.head
            }

            return this.currentSong.value
        }

        // No songs in queue
        return undefined
    }

    /**
     * Returns the current position of the queue
     * 
     * @returns Current song in the queue
     */
    current() {
        return this.currentSong ? this.currentSong.value : undefined
    }

    /**
     * Moves the position of the queue to the previous song in the queue.
     * If the current song is the first song in the queue, the position
     * is reset to the last song in the queue.
     * 
     * @returns Previous song in queue. Can be undefined.
     */
    previous() {
        if (this.currentSong !== undefined) {
            // Shift to previous song & return it
            this.currentSong = this.currentSong.prev

            // Wrap song to tail if reached end
            if  (this.currentSong == undefined) {
                this.currentSong = this.queue.tail
            }

            return this.currentSong.value
        }

        // No songs in queue
        return undefined
    }

    /**
     * Returns true if the current song precedes another song in the queue.
     * 
     * @returns false if the current song is the last in the queue
     */
    hasNext() {
        return this.currentSong != undefined && this.currentSong.next != undefined
    }

    /**
     * Adds a song to the queue
     * 
     * @param song  Song to add to queue
     */
    addSong(song: Song) {
        this.queue.push(song)

        // Update current song if there was none before
        if (this.currentSong == undefined) {
            this.currentSong = this.queue.head
        }
    }

    /**
     * Adds all the songs from the provided album to the queue.
     * 
     * @param album  Album to add to the queue
     */
    addAlbum(album: Album) {
        album.songs.forEach((song) => this.addSong(song))
    }

    /**
     * Returns the number of songs in the queue, irregardless of the
     * queue's current position (thus it considers the songs before and
     * after the current song)
     */
    songCount() {
        return this.queue.length
    }
}