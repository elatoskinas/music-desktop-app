// React imports
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// CSS imports
import '@css/main.css'

// Component imports
const {MusicController} = require('@player/music-player.tsx')

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <div>
                <MusicController />
            </div>
        );
    }
}

// Render application
ReactDOM.render(<App />, document.getElementById('app'));