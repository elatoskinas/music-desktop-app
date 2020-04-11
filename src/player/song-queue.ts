import * as LinkedList from 'yallist'

export class SongQueue {
    queue: LinkedList

    constructor() {
        // Create new, empty queue
        this.queue = LinkedList.create()
    }
}