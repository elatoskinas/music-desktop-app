import * as React from 'react'
import { MusicPlayer } from '@frontend/MusicPlayer'
import { AppContainer } from './App.styled'

/**
 * Main application component.
 */
export class App extends React.Component {
    render() {
        return (
            <AppContainer>
                <MusicPlayer />
            </AppContainer>
        )
    }
}
