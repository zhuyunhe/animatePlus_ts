

interface AnimateObject {
  elements,
  element,
  keyframes : object[],
  loop: boolean,
  optimize,
  direction,
  change,
  easing,
  duration: number,
  gaussian,
  end,
  options,
  elapsed: number,
  startTime: number
}

// 获取数组的第一个元素
const first = ([item]: string[]) => item;

const easings = {
  "linear": progress => progress,
  "in-cubic": progress => progress ** 3,
  "in-quartic": progress => progress ** 4
}

const getElements = (elements: any) => {
  if(Array.isArray(elements)) {
    return elements
  }
  if(!elements || elements.nodeType) {
    return [elements]
  }
  // Object.assign
  return Array.from(typeof elements === 'string' ? document.querySelectorAll(elements) : elements) 
}

const accelerate = (style, keyframes) => {
  style.willChange = keyframes ? keyframes.map(({property}) => property) : 'auto'
}

const rAF = {
  all: new Set <AnimateObject>(),
  add(object) {
    if(this.all.add(object).size < 2)
      requestAnimationFrame(tick)
  }
}

const trackTime = (timing, now: number) => {
  if(!timing.startTime){
    timing.startTime = now
  }
  timing.elapsed = now - timing.startTime
}

const getProgress = ({ elapsed, duration }: AnimateObject) => {
  return duration > 0 ? Math.min(elapsed / duration, 1) : 1
}

const decomposeEasing = (ease: string) => {
  const [easing, amplitude=1, period = .4] = ease.trim().split(" ");
  return { easing, amplitude, period }
}
const ease = ({easing, amplitude, period}, progress ) => {
  return easings[easing](progress, amplitude, period)
}

const reverseKeyframes = (keyframes) => {
  keyframes.forEach(({numbers}) => numbers.reverse())
}

const resetTime = (object: AnimateObject) => {
  object.startTime = 0
}

const getCurrentValue = (from, to, easing) => {
  return from + (to-from)*easing
}

const recomposeValue = ([from, to], strings, round, easing) => {
  return strings.reduce((style, string, index) => {
    const previous = index - 1;
    const value = getCurrentValue(from[previous], to[previous], easing);
    return style + (round && index < 4 ? Math.round(value) : value) + string;
  })
}

const createStyles = (keyframes, easing) => {
  return keyframes.reduce((style, {property, numbers, strings, round})=>{
    style[property] = recomposeValue(numbers, strings, round, easing)
    return style
  }, {})
}

const tick = (now:number) => {
  const {all} = rAF;
  all.forEach((object: AnimateObject) => {
    trackTime(object, now);
    const progress = getProgress(object);
    const {
      element,
      keyframes,
      loop,
      optimize,
      direction,
      change,
      easing,
      duration,
      gaussian,
      end,
      options
    } = object

    if(direction){
      let curve = progress
      console.log(`progress: ${progress}`)
      switch(progress){
        case 0:
          if(direction === 'alternate'){
            reverseKeyframes(keyframes)
          }
        break;
        // progress为1，动画结束
        case 1: 
          if(loop) {
            resetTime(object)
          } else {
            if(optimize) accelerate(element.style, null)
            all.delete(object)
          }
          if(end && typeof end === 'function'){
            end(options)
          }
          break;
        default: 
          curve = ease(easing, progress)
      }
      if(element){
        console.log(createStyles(keyframes, curve))
        Object.assign(element.style, createStyles(keyframes, curve))
      }

      return
    }

    if(progress < 1) return
    all.delete(object)
    end(duration)
  });

  if(all.size) requestAnimationFrame(tick);
}

const computeValue = (value: Function|string, index) => {
  return typeof value === 'function' ? value(index) : value;
}

const setSpeed = (speed, value, index) => {
  return speed>0 ? computeValue(value, index) / speed : 0
}

// 把不是数字（正负数）的内容提到一个数组中
const extractRegExp = /-?\d*\.?\d+/g;
const extractStrings = (value: string) => {
  return value.split(extractRegExp)
}
const extractNumbers = (value: string) => {
  return value.match(extractRegExp)!.map(Number)
}

const sanitize = (values: any[]) => {
  return values.map((value) => {
    const _value = String(value);
    return _value.startsWith('#') ? '' : _value;
  })
}


const addPropertyKeyframes = (property, values: any[]) => {
  const animatable: string[] = sanitize(values);
  const strings: string[] = extractStrings(first(animatable));
  const numbers: number[][] = animatable.map(extractNumbers);
  const round: boolean = first(strings).startsWith('rgb');
  return { property, strings, numbers, round }
}


const createAnimationKeyframes = (keyframes, index) => {
  return Object.entries(keyframes).map(([property, values]) => {
    return addPropertyKeyframes(property, computeValue(<string|Function>values, index))
  })

}

const addAnimations = (options, resolve) => {
  const {
    elements = null,
    easing = "linear",
    duration = 1000,
    delay: timeout = 0,
    speed = 1,
    loop = false,
    optimize = false,
    direction = "normal",
    blur = null,
    change = null,
    ...rest
  } = options
  
  const last = {
    totalDuration: -1,
    animation: {
      end: '',
      options: {}
    }
  }

  getElements(elements).forEach(async (element, index) => {
    const keyframes = createAnimationKeyframes(rest, index);
    console.log(keyframes)
    const animation: AnimateObject = {
      elements,      
      element,
      keyframes,
      loop,
      optimize,
      direction,
      change,
      easing: decomposeEasing(easing),
      duration: setSpeed(speed, duration, index),
      end: '',
      gaussian: 0,
      options,
      elapsed: 0,
      startTime: 0
    };

    const animationTimeout = setSpeed(speed, timeout, index);
  
    const totalDuration = animationTimeout + animation.duration;

    // 反向动画
    if(direction !== 'normal'){
      reverseKeyframes(keyframes)
    }
   
    //利用willchange属性优化
    if (element && optimize){
      accelerate(element.style, keyframes)
    }

    if(totalDuration > last.totalDuration){
      last.animation = animation;
      last.totalDuration = totalDuration;
    }

    if (animationTimeout) await delay(animationTimeout)

    rAF.add(animation)

  });

  const { animation } = last;
  if(!animation) return
  animation.end = resolve;
}

export default options => 
  new Promise(resolve => addAnimations(options, resolve))

export const delay = (duration: number) => {
  new Promise(resolve => rAF.add({
    duration,
    end: resolve
  }))
}

