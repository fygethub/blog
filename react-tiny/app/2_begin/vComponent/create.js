//vComponent 结构
const createVComponent = function(type, props) {
    return {
        type,
        props,
        dom: null,
    }
}

export default createVComponent;