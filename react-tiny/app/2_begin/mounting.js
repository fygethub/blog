import { default as mountVElement } from './vElement/mount.js';
import { default as mountVComponent } from './vComponent/muont.js';
import { default as mountVText } from './vText/mount.js'


export default function mount(element, parentNode) {
    if (typeof element === 'string' || typeof element === 'number') {
        return mountVText(element, parentNode);
    } else if (typeof element.type === 'function') {
        return mountVComponent(element, parentNode);
    } else {
        return mountVElement(element, parentNode);
    }
}