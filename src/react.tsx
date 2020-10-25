// React imports
import * as React from 'react'
import * as ReactDOM from 'react-dom'

// CSS imports
import '@css/base.css'

// Component imports
import {MusicPlayer} from '@frontend/music-player'

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <div>
                <MusicPlayer />
            </div>
        )
    }
}

// Render application
ReactDOM.render(<App />, document.getElementById('app'))