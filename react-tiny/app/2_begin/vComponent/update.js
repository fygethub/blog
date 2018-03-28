import update from '../updating.js'

export default function updateVComponent(prevComponent, nextComponent) {
    const { _instance } = prevComponent;
    const { _currentElement } = _instance;

    //获取props!
    const prevProps = prevComponent.props;
    const nextProps = nextComponent.props;

    nextComponent.dom = prevComponent.dom;
    nextComponent._instance = _instance;
    nextComponent._instance.props = nextProps;


    const prevRenderedElement = _currentElement;
    const nextRenderedElement = _instance.render();

    nextComponent._instance._currentElement = nextRenderedElement;


    update(prevRenderedElement, nextRenderedElement, _instance.parentNode);
}