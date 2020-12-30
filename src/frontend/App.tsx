import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { MusicPlayer } from '@frontend/MusicPlayer'
import { AppContainer } from './App.styled'
import { HashRouter, Switch, Route } from 'react-router-dom'

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <AppContainer>
                    <Switch>
                        <Route path="/gallery">
                            TODO GALLERY
                        </Route>

                        <Route path="/settings">
                            TODO SETTINGS
                        </Route>

                        <Route path="/playing">
                            TODO PLAYING QUEUE
                        </Route>

                        <Route path="/">
                            <MusicPlayer />
                        </Route>
                    </Switch>
                </AppContainer>
            </HashRouter>
        )
    }
}

export default hot(App)
