function createVElement(tag, config, children = null) {
    const { className, style } = config;
    return {
        tag,
        className,
        style,
        props: {
            children,
        },
        dom: null,
    }
}


function mountVText(vText, parentDOMNode) {
    parentDOMNode.textContent = vText;
}

function mountVElement(vElement, parentDOMNode) {
    const { tag, className, props, style } = vElement;

    //create a native DOM node
    const domNode = document.createElement(tag);

    //for later reference save the DOM node
    //on our vElement
    vElement.dom = domNode;

    if (props.children) {
        if (!Array.isArray(props.children)) {
            mount(velement, domNode);
        }
        props.children.forEach(velement => {
            // function and let it determine what type it is.
            mount(velement, domNode);
        });
    }

    //add className to native node
    if (className !== undefined && className) {
        domNode.className = className;
    }

    if (style !== undefined) {
        if (typeof style !== 'object') { throw 'style must be object' }
        Object.keys(style).forEach(sKey => domNode.style[sKey] = style[sKey]);
    }

    //Append domNode to the DOM
    parentDOMNode.appendChild(domNode);
}

function mount(input, parentNode) {
    if (typeof input === 'number' || typeof input === 'string') {
        mountVText(input, parentNode);
    } else {
        mountVElement(input, parentNode);
    }
}

const myApp = createVElement('div', {
    className: 'my-class',
    style: { width: '100px', height: '100px', background: 'red', height: '100px' }
}, [
    createVElement('h1', {
        style: { color: 'white' }
    }, [
        createVElement('span', {}, ['hello world'])
    ])
]);



/*
 * class vDOMSetInterval
 */

class Component {
    constructor(props = {}) {
        this.props = props;
        setTimeout(() => {
            this.componentDidMount && this.componentDidMount();
        })
    }


    setState(state, fn) {
        this.state = state;
        const newEl = this.renderDOM();
        if (this.onStateChange) { this.onStateChange(newEl) }
        fn && fn();
    }


    renderDOM() {
        this.vel = this.render();
        return this.vel;
    }

}


class vDOMSetInterval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            times: 0,
        }
    }

    componentDidMount() {
        this.setState({
            times: ++this.state.times,
        }, () => console.log(this.state));
    }

    render() {
        return createVElement('div', {
            className: 'my-class',
            style: {
                width: '100px',
                height: '100px',
                background: 'red',
                height: '100px'
            }
        }, [
            createVElement('h1', {
                style: {
                    color: 'white'
                }
            }, [
                createVElement('span', {}, [this.state.times])
            ])
        ])

    }

}


const renderDOM = (Component, wrapper) => {
    mount(Component.renderDOM(), app);
    Component.onStateChange = (newEl) => {
        wrapper.innerHTML = '';
        mount(Component.renderDOM(), app);
    }
}

let vdom = new vDOMSetInterval();
renderDOM(vdom, app);