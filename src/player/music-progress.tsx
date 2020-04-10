import * as React from 'react'

import {PLAY_STATUS} from '@common/status.ts'
import {formatTimestamp} from '@common/format-utils.ts'

interface MusicProgressProps {
    sound: Howl,
    status: string,
    duration: number
}

interface MusicProgressState {
    time: number
}

/**
 * Component to display sound progress info with regards to the duration.
 * Contains the current sound as the property, and keeps track of the sound duration
 * & time for the state.
 */
export class MusicProgress extends React.Component<MusicProgressProps, MusicProgressState> {
    timeInterval: ReturnType<typeof setInterval>
    tickInterval = 200

    constructor(props) {
        super(props)

        this.state = {
            'time': 0
        }

        this.onProgressBarHold = this.onProgressBarHold.bind(this)
        this.onProgressBarRelease = this.onProgressBarRelease.bind(this)
        this.onProgressBarChange = this.onProgressBarChange.bind(this)
    }

    /**
     * Updates the progress of the song in terms of state by querying
     * the song's duration and current position.
     */
    updateSongProgress() {
        const sound = this.props.sound

        if (sound != null && sound.state() == 'loaded') {
            const time = sound.seek() as number

            // Time might sometimes still resolve to a Howl object. Thus,
            // an explicit check should be made before assigning the new time value.
            if (typeof time === 'number') {
                this.setState({
                    'time': time // Get current position
                })
            }
        }
    }

    /**
     * Updatess the song progress and sets a new timeout to perform
     * this update on the next tick.
     */
    timeStep() {
        this.updateSongProgress()
        this.timeInterval = setTimeout(() => this.timeStep(), this.tickInterval)
    }

    /**
     * Get the current progress in percentage (in 0 to 100 range as float) of
     * the current song, or 0 if no song is in progress.
     * 
     * @param time       Current time of song
     * @param duration   Duration of song
     */
    // getProgress(time: number, duration: number) {
    //     return ((duration == 0 ? 0 : Math.floor(time)/Math.floor(duration)) * 100)
    // }

    getProgress() {
        let duration = this.props.duration
        let time = this.state.time
        return ((duration == 0 ? 0 : Math.floor(time)/Math.ceil(duration)) * 100)
    }

    onPlayStatusChange(status: string) { // eslint-disable-line no-unused-vars
        // Unused var error suppressed for now due to there being a use-case
        // for the new status string.

        // Stop previous time interval
        if (this.timeInterval !== undefined) {
            clearInterval(this.timeInterval)
        }

        // Immediately update song progress
        this.updateSongProgress()

        // Begin a new interval (only if playing)
        if (this.props.status === PLAY_STATUS.PLAYING) {
            this.timeStep()
        }
    }

    componentDidUpdate(prevProps) {
        // Reset time step if sound changes
        if (this.props.sound !== prevProps.sound) {
            this.setState({
                'time': 0
            })
        }
        
        if (this.props.status !== prevProps.status) {
            this.onPlayStatusChange(this.props.status)
        }
    }

    onProgressBarHold() {
        // Stop advancing progress bar while holding progress bar
        clearInterval(this.timeInterval)
    }

    onProgressBarChange(e) {
        // Update state with new time
        this.setState({
            'time': e.target.value
        })
    }

    onProgressBarRelease(e) {
        // Seek sound
        this.props.sound.seek(e.target.value)

        // Continue advancing progress bar
        if (this.props.status === PLAY_STATUS.PLAYING) {
            this.timeStep()
        }
    }

    render() {
        const progressBar = (
            <input id="musicProgress" type="range"
                min="0"
                max={ Math.ceil(this.props.duration) }
                step="1"
                onMouseDown={this.onProgressBarHold}
                onChange={this.onProgressBarChange}
                onMouseUp={this.onProgressBarRelease}
                value={ Math.floor(this.state.time) }
                style={{ background: `linear-gradient(to right, #48a4ff 0%, #48a4ff ${this.getProgress()}%, #d3d3d3 ${this.getProgress()}%, #d3d3d3 100%)` }}>
            </input>
        )

        return (
            <div>
                <p>
                    {
                        formatTimestamp(this.state.time) + '/' + formatTimestamp(this.props.duration)
                    }
                </p>

                {progressBar}
            </div>
        )
    }
}