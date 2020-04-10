// React imports
import * as React from 'react'
import { Song } from '@music-data/music-data.ts' // eslint-disable-line no-unused-vars

/**
 * Component to display music info, such as the title, artist or album.
 * Has song metadata as the properties that is a Song object containing relevant metadata.
 */
export class MusicInfo extends React.Component<{ metadata : Song }, {}> {
    constructor(props) {
        super(props)
    }

    /**
     * Returns an img-friendly src string from a specified format and data buffer.
     * @param format MIME type of data
     * @param data   Data buffer of image
     */
    imageBufferToSource(format: string, data: Buffer) {
        return `data:${format}; base64,
                ${data.toString('base64')}`
    }

    render() {
        const meta = this.props.metadata

        if (meta) {
            let coverSource = ''

            if (meta.covers && meta.covers.length > 0) {
                coverSource = this.imageBufferToSource(meta.covers[0].format, meta.covers[0].data)
            }

            return (
                <div className='song-info'>
                    <img src={coverSource} className='song-cover' />
                    <p>Title: {meta.title}</p>
                    <p>Artist: {meta.artist}</p>
                    <p>Album: {meta.album}</p>
                </div>
            )
        }

        return null
    }
}