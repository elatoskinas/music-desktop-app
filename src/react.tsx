import * as React from 'react';
import * as ReactDOM from 'react-dom';

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

/**
 * Main application component.
 */
class App extends React.Component {
    render() {
        return <Button />
    }
}
 
ReactDOM.render(<App />, document.getElementById('app'));