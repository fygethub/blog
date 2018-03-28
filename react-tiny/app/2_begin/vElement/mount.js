import mount from '../mounting';

const mountVElement = function(vElement, parentDOM) {
    const { type, style, className, props } = vElement;
    const children = props.children;
    const domNode = document.createElement(type);
    //这里假定dom解构未改变只是 dom
    vElement.dom = domNode;

    if (style !== undefined) {
        Object.keys(style).forEach(key => domNode.style[key] = style[key]);
    }
    if (className !== undefined) {
        domNode.className = className;
    }

    //这里 mount children
    if (children) {
        if (!Array.isArray(children)) {
            mount(children, domNode); //调用mount 不用管类型
        } else {
            children.forEach((child) => mount(child, domNode));
        }
    }

    parentDOM.appendChild(domNode);
    return domNode;
}

export default mountVElement;