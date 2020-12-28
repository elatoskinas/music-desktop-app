import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { MusicPlayer } from '@frontend/MusicPlayer'
import { AppContainer } from './App.styled'

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <AppContainer>
                <MusicPlayer />
                <p>!</p>
            </AppContainer>
        )
    }
}

export default hot(App)
