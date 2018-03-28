import { default as updateVElement } from './vElement/update.js';
import { default as updateVComponent } from './vComponent/update.js';
import { default as updateVText } from './vText/update.js';


export default function update(prev, next) {
    if (prev.type === next.type) {
        if (typeof prev.type === 'string') {
            updateVElement(prev, next);
        } else if (typeof prev.type === 'function') {
            updateVComponent(prev, next);
        } else {
            //不同类型 直接替换操作
        }
    }
}