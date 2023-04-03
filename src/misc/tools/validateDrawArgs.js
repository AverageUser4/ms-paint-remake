export default function validateDrawArgs({
  primaryContext,
  secondaryContext,
  brushContext,
  currentPixel,
  currentlyPressedRef,
  toBeValidatedArray,
  color,
  isRepeated,
  primaryImageData,
  canvasZoom,
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
      name !== 'brushContext' &&
      name !== 'currentPixel' &&
      name !== 'currentlyPressedRef' &&
      name !== 'color' &&
      name !== 'isRepeated' &&
      name !== 'primaryImageData' &&
      name !== 'canvasZoom'
    ) {
      throw new Error(`"toBeValidatedArray" contains unexpected value: "${name}".`);
    }
  }
  
  if(is('primaryContext') && !(primaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"primaryContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, secondaryContext);
  }
  if(is('secondaryContext') && !(secondaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"secondaryContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, secondaryContext);
  }
  if(is('brushContext') && !(brushContext instanceof CanvasRenderingContext2D)) {
    console.error(`"brushContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, brushContext);
  }
  if(is('currentPixel') && (typeof currentPixel !== 'object' || !Number.isInteger(currentPixel?.x) || !Number.isInteger(currentPixel?.y))) {
    console.error(`"currentPixel" argument has to be an object containing properties "x" (integer) and "y" (integer), provided:`, currentPixel);
  }
  if(is('currentlyPressedRef') && (typeof currentlyPressedRef !== 'object' || !Number.isInteger(currentlyPressedRef.current))) {
    console.error(`"currentlyPressedRef" argument has to be an object with "current" property (integer), provided:`, currentlyPressedRef);
  }
  if(is('color') && (typeof color !== 'object')) {
    console.error(`"color" argument has to be an object, provided:`, color);
  }
  if(is('isRepeated') && (typeof isRepeated !== 'boolean')) {
    console.error(`"isRepeated" argument has to be a boolean value, provided:`, isRepeated);
  }
  if(is('primaryImageData') && (!(primaryImageData instanceof ImageData))) {
    console.error(`"primaryImageData" argument has to be an instance of ImageData, provided:`, primaryImageData);
  }
  if(is('canvasZoom') && typeof canvasZoom !== 'number') {
    console.error(`"canvasZoom" argument has to be a number, provided:`, canvasZoom);
  }
}