export function add(a: number, b:number) : number{
  return a + b
}

export const test = () => {
  console.log('hah')
}

const getElements = (elements: any) => {
  if(Array.isArray(elements)) {
    return elements
  }
  if(!elements || elements.nodeType) {
    return [elements]
  }
  Object.assign
  return Array.from(typeof elements === 'string' ? document.querySelectorAll(elements) : elements) 
}