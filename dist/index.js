export function add(a, b) {
    return a + b;
}
export var test = function () {
    console.log('hah');
};
var getElements = function (elements) {
    if (Array.isArray(elements)) {
        return elements;
    }
    if (!elements || elements.nodeType) {
        return [elements];
    }
    // Object.assign
    return Array.from(typeof elements === 'string' ? document.querySelectorAll(elements) : elements);
};
var accelerate = function (_a, keyframes) {
    var style = _a.style;
    style.willChange = keyframes ? keyframes.map(function (_a) {
        var property = _a.property;
        return property;
    }) : 'auto';
};
