export default function validateDrawArgs({
  primaryContext,
  secondaryContext,
  brushContext,
  selectionContext,
  thumbnailSecondaryContext,
  selectionSize,
  currentPixel,
  currentlyPressedRef,
  toBeValidatedArray,
  color,
  isRepeated,
  primaryImageData,
  canvasZoom,
}) {
  try {
    if(!Array.isArray(toBeValidatedArray) || toBeValidatedArray.length === 0) {
      throw new Error(`"toBeValidatedArray" has to be a non-empty array, provided: "${toBeValidatedArray}".`);
    }
  
    for(let name of toBeValidatedArray) {
      if( 
        name !== 'primaryContext' &&
        name !== 'secondaryContext' &&
        name !== 'brushContext' &&
        name !== 'selectionContext' &&
        name !== 'thumbnailSecondaryContext' &&
        name !== 'currentPixel' &&
        name !== 'currentlyPressedRef' &&
        name !== 'color' &&
        name !== 'isRepeated' &&
        name !== 'primaryImageData' &&
        name !== 'canvasZoom' &&
        name !== 'selectionSize'
      ) {
        throw new Error(`"toBeValidatedArray" contains unexpected value: "${name}".`);
      }
    }
  } catch(error) {
    console.error(error);
  }

  function is(str) {
    return toBeValidatedArray.includes(str);
  }
  
  if(is('primaryContext') && !(primaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"primaryContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, primaryContext);
  }
  if(is('secondaryContext') && !(secondaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"secondaryContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, secondaryContext);
  }
  if(is('brushContext') && !(brushContext instanceof CanvasRenderingContext2D)) {
    console.error(`"brushContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, brushContext);
  }
  if(is('selectionContext') && !(selectionContext instanceof CanvasRenderingContext2D)) {
    console.error(`"selectionContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, selectionContext);
  }
  if(is('thumbnailSecondaryContext') && !(thumbnailSecondaryContext instanceof CanvasRenderingContext2D) && typeof thumbnailSecondaryContext !== 'undefined') {
    console.error(`"thumbnailSecondaryContext" argument has to be an instance of CanvasRenderingContext2D or undefined, provided:`, thumbnailSecondaryContext);
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
  if(is('selectionSize') && (typeof selectionSize !== 'object' || !Number.isInteger(selectionSize?.width) || !Number.isInteger(selectionSize?.height))) {
    console.error(`"selectionSize" argument has to be an object containing properties "width" (integer) and "height" (integer), provided:`, selectionSize);
  }
}