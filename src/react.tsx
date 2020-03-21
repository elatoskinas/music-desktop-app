import * as React from 'react';
import * as ReactDOM from 'react-dom';

// IPCRenderer that can be used to send events to main process
const ipc = require('electron').ipcRenderer;

/**
 * Single button component.
 * Testing for now.
 */
class Button extends React.Component {
    test() {
        alert('Test!')
    }

    render() {
        return <button onClick={this.test}>Play Sound</button>;
    }
}

class FileSelectionButton extends React.Component {
    openFileSelection() {
        ipc.send('openFileSelection', {
            folders: true
        })
    }

    render() {
        // @ts-ignore
        // TODO: Type error here in webkitdir/directory?
        return <button onClick={this.openFileSelection}>Open Directory</button>
    }
}

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return (
            <div>
                <Button />
                <FileSelectionButton />
            </div>
        );
    }
}
 
ReactDOM.render(<App />, document.getElementById('app'));