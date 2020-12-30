import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { MusicPlayer } from '@frontend/MusicPlayer'
import { AppContainer, AppContentPanel } from './App.styled'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { MusicController } from './MusicController'
import { NavBar } from './NavBar'

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <AppContainer>
                    <AppContentPanel>
                        <NavBar />
                        <Switch>
                            <Route path="/gallery">
                                <h1>Gallery</h1>
                            </Route>

                            <Route path="/settings">
                                <h1>Settings</h1>
                            </Route>

                            <Route path="/playing">
                                <h1>Queue</h1>
                                <MusicPlayer />
                            </Route>

                            <Route path="/">
                                <h1>Home</h1>
                            </Route>
                        </Switch>
                    </AppContentPanel>

                    <MusicController
                        sound={null}
                        onSongEnded={() => { console.log('End song') }}
                        onPreviousSong={() => { console.log('Previous song' )}}
                        onNextSong={() => { console.log('Next song') }}
                    />
                </AppContainer>
            </HashRouter>
        )
    }
}

export default hot(App)
