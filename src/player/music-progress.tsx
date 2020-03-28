import * as React from 'react';

/**
 * Component to display sound progress info with regards to the duration.
 * Contains the current sound as the property, and keeps track of the sound duration
 * & time for the state.
 */
export class MusicProgress extends React.Component<{ sound: Howl, status: string, duration: number }, { time: number }> {
    timeInterval: ReturnType<typeof setInterval>;

    constructor(props) {
        super(props);

        this.state = {
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

            if (typeof time == 'number') {
                this.setState({
                    'time': time // Get current position
                });
            }
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
        return ((duration == 0 ? 0 : Math.floor(time)/Math.floor(duration)) * 100)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Reset time step if sound changes
        if (this.props.sound != prevProps.sound) {
            this.setState({
                'time': 0
            })
        }
        
        if (this.props.status != prevProps.status) {
            // Stop previous time interval
            if (this.timeInterval !== undefined) {
                clearInterval(this.timeInterval);
            }

            // Immediately update song progress
            this.updateSongProgress();

            // Begin a new interval (only if playing)
            if (this.props.status == "Playing") {
                this.timeInterval = setInterval(
                    () => {
                        console.log(this.state.time)
                        this.updateSongProgress()
                    },
                    500
                );
            }
        }
    }

    render() {
        const time = this.state.time

        // Get progress value to use as width for progress bar
        const newProgress = this.getProgress(time, this.props.duration) + '%'

        return (
            <div>
                <p>
                    {
                        this.formatTimestamp(time) + "/" + this.formatTimestamp(this.props.duration)
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