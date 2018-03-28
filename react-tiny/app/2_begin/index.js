import { default as Component } from './Component.js';
import { default as createElement } from './creating.js'
import { default as mount } from './mounting.js';
import { create } from 'domain';

function roundColor(num) {
    return Math.round(Math.random() * num);
}
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            count: 1,
        };





    }


    render() {
        return createElement('div', {
            style: {
                background: `rgba(${roundColor(10 * this.state.count)}, ${roundColor(5 * this.state.count)}, ${roundColor(8 * this.state.count)},${Math.random()})`
            }
        }, [
            'hi',
            createElement(App1, { message: this.state.count }),
            createElement('h1', {}, this.state.count)
        ])
    }
}
class App1 extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return createElement('div', { style: { color: 'red' } }, [
            'hi',
            createElement('h1', {}, this.props.message)
        ])
    }
}

const vElement = createElement(App, { message: 'Hello there!' });
console.log(vElement);
mount(vElement, app);