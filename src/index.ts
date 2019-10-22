export function add(a: number, b:number) : number{
  return a + b
}

interface AnimateObject {
  elements,
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

const accelerate = ({style}, keyframes) => {
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
  keyframes.forEanch(({numbers}) => numbers.reverse())
}

const resetTime = (object: AnimateObject) => {
  object.startTime = 0
}

const tick = (now:number) => {
  const {all} = rAF;
  all.forEach((object: AnimateObject) => {
    trackTime(object, now);
    const progress = getProgress(object);
    const {
      elements,
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
      switch(progress){
        case 0:
          if(direction === 'alternate'){
            reverseKeyframes(keyframes)
          }
        break;
        case 1: 
          if(loop) {
            resetTime(object)
          } else{
            all.delete(object)
          }
          if(end && typeof end === 'function'){
            end(options)
          }
          break;
        default: 
          curve = ease(easing, progress)
      }

      return
    }

    if(progress < 1) return
    all.delete(object)
    end(duration)
  });

  if(all.size) requestAnimationFrame(tick);
}

const createAnimationKeyframes = (keyframes, index) => {
  Object.entries(keyframes)

}

const addAnimations = (options, resolve) => {
  const {
    elements = null,
    easing = "linear",
    duration = 1000,
    speed = 1,
    loop = false,
    optimize = false,
    direction = "normal",
    blur = null,
    change = null,
    ...rest
  } = options
  
  const last = {
    totalDuration: -1
  }

  getElements(elements).forEach(async (element, index) => {
    const keyFrames = createAnimationKeyframes(rest, index)
  })

}

