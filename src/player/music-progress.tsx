import * as React from 'react';

/**
 * Component to display sound progress info with regards to the duration.
 * Contains the current sound as the property, and keeps track of the sound duration
 * & time for the state.
 */
export class MusicProgress extends React.Component<{ sound: Howl }, { duration: number, time: number }> {
    timeInterval: ReturnType<typeof setInterval>;

    constructor(props) {
        super(props);

        this.state = {
            'duration': 0,
            'time': 0
        };
    }

    /**
     * Formats the specified number into a string of format hh:mm:ss
     * 
     * TODO: Exclude hours/mins if n/a
     * TODO: Move to utility class?
     * 
     * @param time  Time as number to format
     */
    formatTimestamp(time: number) {
        return new Date(time * 1000).toISOString().substr(11, 8)
    }

    /**
     * Updates the progress of the song in terms of state by querying
     * the song's duration and current position.
     */
    updateSongProgress() {
        const sound = this.props.sound;

        if (sound != null && sound.state() == 'loaded') {
            const time = sound.seek() as number
            const duration = sound.duration() as number

            this.setState({
                'duration': duration, // Get duration
                'time': time // Get current position
            });
        }
    }

    /**
     * Get the current progress in percentage (in 0 to 100 range as float) of
     * the current song, or 0 if no song is in progress.
     * 
     * @param time       Current time of song
     * @param duration   Duration of song
     */
    getProgress(time: number, duration: number) {
        return ((duration == 0 ? 0 : time/duration) * 100)
    }

    componentDidMount() {
        // Time interval (progress bar)
        this.timeInterval = setInterval(
            () => {
                this.updateSongProgress()
            },
            1000
        );
    }

    render() {
        const time = this.state.time
        const duration = this.state.duration

        // Get progress value to use as width for progress bar
        const newProgress = this.getProgress(time, duration) + '%'

        return (
            <div>
                <p>
                    {
                        this.formatTimestamp(time) + "/" + this.formatTimestamp(duration)
                    }
                </p>

                <div id="musicProgress">
                    <div id="musicProgressBar" style ={{ width: newProgress }} >
                    </div>
                </div>
            </div>
        )
    }
}