import update from './updating';

export default class Component {
    constructor(props = {}) {
        this.props = props;
        this._pendingState = null;
        this._currentElement = null;
        this._parentNode = null;
    }

    //更新组件
    updateComponent() {
        const prevRenderElement = this._currentElement;
        if (this._pendingState != null) {
            this.state = this._pendingState;
        }
        this._pendingState = null;

        //获取state改变后的render
        const nextRenderElement = this.render();

        //修改当前renderElement
        this._currentElement = nextRenderElement;

        //执行更新
        update(prevRenderElement, nextRenderElement, this._parentNode);

    }

    setState(partialNewState) {
        this._pendingState = Object.assign({}, this.state, partialNewState);
        this.updateComponent();
    }

    render() {}
}