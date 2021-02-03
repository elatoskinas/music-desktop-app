import * as React from 'react'
import { AppContext, AppContextState } from './AppContext'

export class Settings extends React.Component<{}, {}> {
    static contextType = AppContext

    constructor(props) {
        super(props)
    }

    render() {
        const { getPreference, storePreference } = this.context as AppContextState

        return (
            <div>
                <h1>Settings</h1>
            </div>
        )
    }
}
