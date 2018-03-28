const createVElement = function(type, config = {}, children = null) {
    const { style, className } = config;
    return {
        type,
        style,
        className,
        props: {
            children,
        },
    }
}

export default createVElement;