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

function createVComponent(tag, props) {
    return {
        tag,
        props,
        dom: null,
    }
}

function createElement(tag, config, children) {
    // If the tag is a function. We have a component!
    if (typeof tag === 'function') {
        const vNode = createVComponent(tag, config);
        return vNode;
    }

    //Add children on our props object, just as in React. Where
    //we can acces it using this.props.children;
    const vNode = createVElement(tag, config, children);
    return vNode;
}

function mountVText(vText, parentDOMNode) {
    const text = document.createTextNode(vText);
    parentDOMNode.appendChild(text);
    return text;
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
            mount(props.children, domNode)
        } else {
            props.children.forEach(child => mount(child, domNode));
        }
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
    return domNode;
}

function mount(input, parentNode) {
    if (typeof input === 'number' || typeof input === 'string') {
        return mountVText(input, parentNode);
    } else if (typeof input.tag === 'function') {
        return mountVComponent(input, parentNode);
    } else {
        return mountVElement(input, parentNode);
    }
}

function mountVComponent(vComponent, parentDOMNode) {
    const { tag, props } = vComponent;

    // build a component instance. This uses the 
    // defined Component class. For brevity 
    // call it Component. Not needed ofcourse, new tag(props)
    // would do the same. 

    const Component = tag;
    const instance = new Component(props);

    // The instance or Component has a render() function 
    // that returns the user-defined vNode.
    const nextRenderedElement = instance.render();

    //create a reference of our currenElement
    //on our component instance.
    instance._currentElement = nextRenderedElement;

    //create a reference to the passed
    //DOMNode. We might need it.
    instance._parentNode = parentDOMNode;

    // the currentElement can be a vElement or a
    // vComponent. mountVComponent doenst't care. Let the mount()
    // handle that!
    const dom = mount(nextRenderedElement, parentDOMNode);

    //save the instance for later
    //references! 
    vComponent._instance = instance;
    vComponent.dom = dom;

    //append the DOM we've created.
    // parentDOMNode.appendChild(dom);

    return dom;
}


function update(prevElement, nextElement) {
    if (prevElement.tag === nextElement.tag) {
        if (typeof prevElement.tag === 'string') {
            updateVElement(prevElement, nextElement);
        } else if (typeof prevElement.tag === 'function') {
            updateVComponent(prevElement, nextElement);
        }
    } else {
        //Oh oh two elements of different types. We don't want to 
        //look further in the tree! We need to replace it!
    }
}

function updateVComponent(prevComponent, nextComponent) {
    //get the instance. This is Component. It also 
    //holds the props and _currentElement; 
    const { _instance } = prevComponent;
    const { _currentElement } = _instance;


    //get the new and old props!
    const prevProps = prevComponent.props;
    const nextProps = nextComponent.props;


    //Time for the big swap!
    nextComponent.dom = prevComponent.dom;
    nextComponent._instance = _instance;
    nextComponent._instance.props = nextProps;

    if (_instance.shouldComponentUpdate(nextProps)) {
        const prevRenderedElement = _currentElement;
        const nextRenderedElement = _instance.render();

        //finaly save the nextRenderedElement for the next iteration!
        nextComponent._instance._currentElement = nextRenderedElement;

        //call update 
        update(prevRenderedElement, nextRenderedElement, _instance._parentNode);
    }
}


function updateVElement(prevElement, nextElement) {
    //get the native DOMnode information. 
    const dom = prevElement.dom;

    //store the native DOMnode information.
    //on our nextElement.  
    nextElement.dom = dom;

    if (nextElement.props.children) {
        updateChildren(prevElement.props.children, nextElement.props.children, dom);
    }

    const nextStyle = nextElement.style;
    const nextClassName = nextElement.className;

    if (prevElement.className !== nextClassName) {
        dom.className = nextClassName;
    }

    if (prevElement.style !== nextStyle) {
        //The style has changed!
        Object.keys(nextStyle).forEach((s) => dom.style[s] = nextStyle[s])
    }
}

function updateVText(prevText, nextText, parentDOM) {
    if (prevText !== nextText) {
        parentDOM.firstChild.nodeValue = nextText;
    }
}


function updateChildren(prevChildren, nextChildren, parentDOMNode) {
    if (!Array.isArray(nextChildren)) {
        nextChildren = [nextChildren];
    }

    if (!Array.isArray(prevChildren)) {
        prevChildren = [prevChildren];
    }

    for (let i = 0; i < nextChildren.length; i++) {
        const nextChild = nextChildren[i];
        const prevChild = prevChildren[i];
        //Check if the vNode is a vText
        if (typeof nextChild === 'string' && typeof prevChild === 'string') {
            updateVText(prevChild, nextChild, parentDOMNode);
            continue;
        } else {
            update(prevChild, nextChild);
        }
    }

}




class Component {
    constructor(props) {
        this.props = props || {};
        this._currentElement = null;
        this._pendingState = null;
        this._parentNode = null;
    }

    updateComponent() {

        const prevState = this.state;
        const prevElement = this._currentElement;

        if (this._pendingState !== prevState) {
            this.state = this._pendingState;
        }

        //reset _pendingState
        this._pendingState = null;
        const nextRenderedElement = this.render();
        this._currentElement = nextRenderedElement;

        //get it in the native DOM
        update(prevElement, nextRenderedElement, this._parentNode);
    }


    setState(partialNewState) {
        // Awesome things to come
        this._pendingState = Object.assign({}, this.state, partialNewState);
        this.updateComponent();
    }

    //add this in existing code
    shouldComponentUpdate() {
        return true;
    }

    //will be overridden
    render() {}
}

class NestedApp extends Component {
    constructor(props) {
        super(props);
    }


    shouldComponentUpdate(newProps) {
        return this.props.counter % 2;
    }

    render() {
        return createElement('h1', { style: { color: '#' + Math.floor(Math.random() * 16777215).toString(16) } }, `The count from parent is: ${this.props.counter}`)
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            counter: 1,
        }
        setInterval(() => {
            this.setState({ counter: this.state.counter + 1 })
        }, 5000);
    }

    shouldComponentUpdate(newProps) {
        console.log(newProps)
        return this.props.counter % 2;
    }

    render() {
        const { counter } = this.state;
        return createElement('div', { className: `${'class-'+this.state.counter}`, style: { height: `${10 * counter}px`, background: '#' + Math.floor(Math.random() * 16777215).toString(16) } }, [
            `the counter is ${counter}`,
            createElement('h1', { style: { color: '#' + Math.floor(Math.random() * 16777215).toString(16) } }, 'BOOM!'),
            createElement(NestedApp, { counter: counter })
        ]);
    }
}

const vElement = createElement(App, { message: 'Hello there!' });
console.log(vElement)
mount(vElement, app);