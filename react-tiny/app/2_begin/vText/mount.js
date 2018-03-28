const mountVText = function(vText, parentNode) {
    const domText = document.createTextNode(vText);
    //文字或者数字,直接放入加到父元素中
    parentNode.appendChild(domText);
    return domText;
}

export default mountVText;