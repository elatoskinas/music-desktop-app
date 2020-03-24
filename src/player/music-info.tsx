// React imports
import * as React from 'react';
import { Song } from '../music-data/music-data';

/**
 * Component to display music info, such as the title, artist or album.
 * Has song metadata as the properties that is a Song object containing relevant metadata.
 */
export class MusicInfo extends React.Component<{ metadata : Song }, {}> {
    constructor(props) {
        super(props);
    }

    render() {
        const meta = this.props.metadata;

        if (meta) {
            return (
                <div>
                    <p>Title: {meta.title}</p>
                    <p>Artist: {meta.artist}</p>
                    <p>Album: {meta.album}</p>
                </div>
            )
        }

        return null
    }
}