import update from '../updating';
import updateText from '../vText/update'

//更新 vdom
export default function updateVElement(prevElement, nextElement) {
    //简单起见直接更新dom  style  className.
    const { style, className, props } = nextElement;
    const dom = prevElement.dom;
    nextElement.dom = dom;

    //更新样式
    if (prevElement.style !== style) {
        Object.keys(style).forEach(key => dom.style[key] = style[key]);
    }

    //更新class 选择器名称
    if (prevElement.className !== className) {
        dom.className = className;
    }

    //更新children
    if (prevElement.props.children !== props.children) {
        //简单的实现,
        updateChildren(prevElement.props.children, props.children, dom);
    }
}


function updateChildren(prevElement, nextElement, parentNode) {
    if (!Array.isArray(prevElement)) {
        prevElement = [prevElement];
    }

    if (!Array.isArray(nextElement)) {
        nextElement = [nextElement];
    }

    for (let i = 0; i < nextElement.length; i++) {
        const prev = prevElement[i];
        const next = nextElement[i];
        //如果是文字更新,则调用text更新
        if (typeof prev === 'string' && typeof next === 'string' || (typeof prev === 'number' && typeof next === 'number')) {
            updateText(prev, next, parentNode);
            continue;
        } else {
            //调用vElement 或者vComponent 更新
            update(prev, next);
        }
    }
}