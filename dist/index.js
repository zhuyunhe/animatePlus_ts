var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// 获取数组的第一个元素
var first = function (_a) {
    var item = _a[0];
    return item;
};
var easings = {
    "linear": function (progress) { return progress; },
    "in-cubic": function (progress) { return Math.pow(progress, 3); },
    "in-quartic": function (progress) { return Math.pow(progress, 4); },
    "in-quintic": function (progress) { return Math.pow(progress, 5); }
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
var accelerate = function (style, keyframes) {
    style.willChange = keyframes ? keyframes.map(function (_a) {
        var property = _a.property;
        return property;
    }) : 'auto';
};
var rAF = {
    all: new Set(),
    add: function (object) {
        if (this.all.add(object).size < 2)
            requestAnimationFrame(tick);
    }
};
var trackTime = function (object, now) {
    if (!object.startTime) {
        object.startTime = now;
    }
    object.elapsed = now - object.startTime;
};
var getProgress = function (_a) {
    var elapsed = _a.elapsed, duration = _a.duration;
    return duration > 0 ? Math.min(elapsed / duration, 1) : 1;
};
var decomposeEasing = function (ease) {
    var _a = ease.trim().split(" "), easing = _a[0], _b = _a[1], amplitude = _b === void 0 ? 1 : _b, _c = _a[2], period = _c === void 0 ? .4 : _c;
    return { easing: easing, amplitude: amplitude, period: period };
};
var ease = function (_a, progress) {
    var easing = _a.easing, amplitude = _a.amplitude, period = _a.period;
    return easings[easing](progress, amplitude, period);
};
var reverseKeyframes = function (keyframes) {
    keyframes.forEach(function (_a) {
        var numbers = _a.numbers;
        return numbers.reverse();
    });
};
var resetTime = function (object) {
    object.startTime = 0;
};
var getCurrentValue = function (from, to, easing) {
    return from + (to - from) * easing;
};
var recomposeValue = function (_a, strings, round, easing) {
    var from = _a[0], to = _a[1];
    return strings.reduce(function (style, string, index) {
        var previous = index - 1;
        var value = getCurrentValue(from[previous], to[previous], easing);
        return style + (round && index < 4 ? Math.round(value) : value) + string;
    });
};
var createStyles = function (keyframes, easing) {
    return keyframes.reduce(function (style, _a) {
        var property = _a.property, numbers = _a.numbers, strings = _a.strings, round = _a.round;
        style[property] = recomposeValue(numbers, strings, round, easing);
        return style;
    }, {});
};
var computeValue = function (value, index) {
    return typeof value === 'function' ? value(index) : value;
};
var setSpeed = function (speed, value, index) {
    return speed > 0 ? computeValue(value, index) / speed : 0;
};
// 把不是数字（正负数）的内容提到一个数组中
var extractRegExp = /-?\d*\.?\d+/g;
var extractStrings = function (value) {
    return value.split(extractRegExp);
};
var extractNumbers = function (value) {
    return value.match(extractRegExp).map(Number);
};
var sanitize = function (values) {
    return values.map(function (value) {
        var _value = String(value);
        // 如果是颜色，需要单独处理
        return _value.startsWith('#') ? rgba(_value) : _value;
    });
};
var rgba = function (hex) {
    var color = hex.slice(1);
    var _a = convert(color), r = _a[0], g = _a[1], b = _a[2], a = _a[3];
    return "rgba(" + r + ", " + g + ", " + b + ", " + a / 255 + ")";
};
var convert = function (color) {
    return hexPairs(color).map(function (string) { return parseInt(string, 16); });
};
var hexPairs = function (color) {
    var split = color.split("");
    var pairs = color.length < 5
        ? split.map(function (string) { return string + string; })
        : split.reduce(function (array, string, index) {
            if (index % 2)
                array.push(split[index - 1] + string);
            return array;
        }, []);
    if (pairs.length < 4)
        pairs.push("ff");
    return pairs;
};
var addPropertyKeyframes = function (property, values) {
    var animatable = sanitize(values);
    var strings = extractStrings(first(animatable));
    var numbers = animatable.map(extractNumbers);
    var round = first(strings).startsWith('rgb');
    return { property: property, strings: strings, numbers: numbers, round: round };
};
var createAnimationKeyframes = function (keyframes, index) {
    return Object.entries(keyframes).map(function (_a) {
        var property = _a[0], values = _a[1];
        return addPropertyKeyframes(property, computeValue(values, index));
    });
};
var addAnimations = function (options, resolve) {
    var _a = options.elements, elements = _a === void 0 ? null : _a, _b = options.easing, easing = _b === void 0 ? "linear" : _b, _c = options.duration, duration = _c === void 0 ? 1000 : _c, _d = options.delay, timeout = _d === void 0 ? 0 : _d, _e = options.speed, speed = _e === void 0 ? 1 : _e, _f = options.loop, loop = _f === void 0 ? false : _f, _g = options.optimize, optimize = _g === void 0 ? false : _g, _h = options.direction, direction = _h === void 0 ? "normal" : _h, _j = options.blur, blur = _j === void 0 ? null : _j, _k = options.change, change = _k === void 0 ? null : _k, rest = __rest(options, ["elements", "easing", "duration", "delay", "speed", "loop", "optimize", "direction", "blur", "change"]);
    var last = {
        totalDuration: -1,
        animation: {
            end: '',
            options: {}
        }
    };
    getElements(elements).forEach(function (element, index) { return __awaiter(void 0, void 0, void 0, function () {
        var keyframes, animation, animationTimeout, totalDuration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    keyframes = createAnimationKeyframes(rest, index);
                    animation = {
                        elements: elements,
                        element: element,
                        keyframes: keyframes,
                        loop: loop,
                        optimize: optimize,
                        direction: direction,
                        change: change,
                        easing: decomposeEasing(easing),
                        duration: setSpeed(speed, duration, index),
                        end: '',
                        blur: null,
                        gaussian: 0,
                        options: options,
                        elapsed: 0,
                        startTime: 0
                    };
                    animationTimeout = setSpeed(speed, timeout, index);
                    totalDuration = animationTimeout + animation.duration;
                    // 反向动画
                    if (direction !== 'normal') {
                        reverseKeyframes(keyframes);
                    }
                    //利用willchange属性优化
                    if (element) {
                        if (optimize) {
                            accelerate(element.style, keyframes);
                        }
                        //高斯模糊，这块先不做
                        if (blur) {
                            animation.blur = computeValue(blur, index);
                            animation.gaussian = {};
                        }
                    }
                    if (totalDuration > last.totalDuration) {
                        last.animation = animation;
                        last.totalDuration = totalDuration;
                    }
                    if (!animationTimeout) return [3 /*break*/, 2];
                    return [4 /*yield*/, delay(animationTimeout)];
                case 1:
                    _a.sent();
                    console.log('delay 结束');
                    _a.label = 2;
                case 2:
                    rAF.add(animation);
                    return [2 /*return*/];
            }
        });
    }); });
    var animation = last.animation;
    if (!animation)
        return;
    animation.end = resolve;
    animation.options = options;
};
var tick = function (now) {
    var all = rAF.all;
    // console.log(`size: ${all.size}`)
    all.forEach(function (object) {
        trackTime(object, now);
        var progress = getProgress(object);
        var element = object.element, keyframes = object.keyframes, loop = object.loop, optimize = object.optimize, direction = object.direction, change = object.change, easing = object.easing, duration = object.duration, gaussian = object.gaussian, end = object.end, options = object.options;
        if (direction) {
            var curve = progress;
            switch (progress) {
                case 0:
                    if (direction === 'alternate') {
                        reverseKeyframes(keyframes);
                    }
                    break;
                // progress为1，动画结束
                case 1:
                    if (loop) {
                        resetTime(object);
                    }
                    else {
                        if (optimize)
                            accelerate(element.style, null);
                        all["delete"](object);
                    }
                    if (end && typeof end === 'function') {
                        end(options);
                    }
                    break;
                default:
                    curve = ease(easing, progress);
            }
            if (element) {
                Object.assign(element.style, createStyles(keyframes, curve));
            }
            if (change)
                change(curve);
            return;
        }
        if (progress < 1)
            return;
        all["delete"](object);
        end(duration);
    });
    if (all.size)
        requestAnimationFrame(tick);
};
export default (function (options) {
    return new Promise(function (resolve) { return addAnimations(options, resolve); });
});
export var delay = function (duration) {
    return new Promise(function (resolve) {
        console.log('delay promise, duration: ' + duration);
        rAF.add({
            duration: duration,
            end: resolve
        });
    });
};
