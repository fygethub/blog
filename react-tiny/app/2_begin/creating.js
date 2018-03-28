import createVElement from './vElement/create';
import createVComponent from './vComponent/create';


export default function createElement(type, props, children = null) {

    if (typeof type === 'string') {
        return createVElement(type, props, children)
    }

    if (typeof type === 'function') {
        return createVComponent(type, props);
    }
}