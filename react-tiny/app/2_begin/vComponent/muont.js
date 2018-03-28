import mount from '../mounting.js'

const mountVComponet = function(vComponent, parentDom) {
    const { type, props } = vComponent;
    const Component = type;
    //实例化自定义组件
    const instance = new Component(props);

    //获取渲染的 vElement
    const nextRenderedElement = instance.render();

    instance._currentElement = nextRenderedElement;
    instance._parentNode = parentDom;

    const dom = mount(nextRenderedElement, parentDom);

    vComponent.dom = dom;
    vComponent._instance = instance;

    return dom;
}
export default mountVComponet;