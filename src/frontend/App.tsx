import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { NowPlaying } from '@frontend/NowPlaying'
import {
    AppContainer,
    AppContentMainPanel,
    AppContentPanel,
} from './App.styled'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { MusicController } from './MusicController'
import { NavBar } from './NavBar'
import {
    AppContextConsumer,
    AppContextProvider,
    AppContextState,
} from './AppContext'
import { Gallery } from './Gallery'

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
                            <AppContentMainPanel>
                                <Switch>
                                    <Route path="/gallery">
                                        <Gallery />
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
                            </AppContentMainPanel>
                        </AppContentPanel>

                        <AppContextConsumer>
                            {(contextValue: AppContextState) => {
                                return (
                                    <MusicController
                                        song={contextValue.activeSong}
                                        onNextSong={contextValue.nextSong}
                                        onPreviousSong={
                                            contextValue.previousSong
                                        }
                                        onSongEnded={contextValue.nextSong}
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
