//更新dom元素下面的文本
const updateText = function(preText, nextText, parentNode) {
    if (preText !== nextText) {
        parentNode.textContent = nextText;
    }
}
export default updateText;