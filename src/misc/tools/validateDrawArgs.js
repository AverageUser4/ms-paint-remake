export default function validateDrawArgs({
  primaryContext,
  secondaryContext,
  currentPixel,
  currentlyPressedRef,
  toBeValidatedArray,
  color
}) {
  if(!Array.isArray(toBeValidatedArray) || toBeValidatedArray.length === 0) {
    throw new Error(`"toBeValidatedArray" has to be a non-empty array, provided: "${toBeValidatedArray}".`);
  }

  function is(str) {
    return toBeValidatedArray.includes(str);
  }

  for(let name of toBeValidatedArray) {
    if( 
      name !== 'primaryContext' &&
      name !== 'secondaryContext' &&
      name !== 'currentPixel' &&
      name !== 'currentlyPressedRef' &&
      name !== 'color'
    ) {
      throw new Error(`"toBeValidatedArray" contains unexpected value: "${name}".`);
    }
  }
  
  if(is('primaryContext') && !(primaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"primaryContext" argument has to be an instance of CanvasRenderingContext2D, provided: "${secondaryContext}".`);
  }
  if(is('secondaryContext') && !(secondaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"secondaryContext" argument has to be an instance of CanvasRenderingContext2D, provided: "${secondaryContext}".`);
  }
  if(is('currentPixel') && (typeof currentPixel !== 'object' || !Number.isInteger(currentPixel?.x) || !Number.isInteger(currentPixel?.y))) {
    console.error(`"currentPixel" argument has to be an object containing properties "x" (integer) and "y" (integer), provided: "${currentPixel}".`);
  }
  if(is('currentlyPressedRef') && (typeof currentlyPressedRef !== 'object' || !Number.isInteger(currentlyPressedRef.current))) {
    console.error(`"currentlyPressedRef" argument has to be an object with "current" property (integer), provided: "${currentlyPressedRef}".`);
  }
  if(is('color') && (typeof color !== 'object')) {
    console.error(`"color" argument has to be an object, provided: "${color}".`);
  }
}