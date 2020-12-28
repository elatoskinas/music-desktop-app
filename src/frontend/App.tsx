import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { MusicPlayer } from '@frontend/MusicPlayer'
import { AppContainer } from './App.styled'
import { HashRouter, Switch, Route, Link } from 'react-router-dom'

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <AppContainer>
                    <Switch>
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
