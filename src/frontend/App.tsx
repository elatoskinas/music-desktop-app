import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { NowPlaying } from '@frontend/NowPlaying'
import { AppContainer, AppContentPanel } from './App.styled'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { MusicController } from './MusicController'
import { NavBar } from './NavBar'
import { AppContextConsumer, AppContextProvider } from './AppContext'

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <AppContextProvider>
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
                                    <NowPlaying />
                                </Route>

                                <Route path="/">
                                    <h1>Home</h1>
                                </Route>
                            </Switch>
                        </AppContentPanel>

                        <AppContextConsumer>
                            {(value) => {
                                return (
                                    <MusicController
                                        song={value.activeSong}
                                        onNextSong={value.nextSong}
                                        onPreviousSong={value.previousSong}
                                        onSongEnded={value.nextSong}
                                    />
                                )
                            }}
                        </AppContextConsumer>
                    </AppContainer>
                </HashRouter>
            </AppContextProvider>
        )
    }
}

export default hot(App)
