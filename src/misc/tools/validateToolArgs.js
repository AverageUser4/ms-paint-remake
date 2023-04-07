export default function validateToolArgs(args, toBeValidatedArray) {
  const namesArray = [
    'primaryContext', 'secondaryContext', 'brushContext', 'selectionContext',
    'thumbnailSecondaryContext', 'currentPixel', 'currentlyPressedRef', 'isRepeated',
    'primaryImageData', 'canvasZoom', 'selectionSize', 'colorData', 'setColorData',
    'event', 'canvasSize', 'thumbnailPrimaryContext', 'doCanvasChangeZoom', 'drawCallback',
    'shapeData', 'isLast', 'thumbnailSelectionContext'
  ];
  
  try {
    if(!Array.isArray(toBeValidatedArray) || toBeValidatedArray.length === 0) {
      throw new Error(`"toBeValidatedArray" has to be a non-empty array, provided: "${toBeValidatedArray}".`);
    }
  
    for(let name of toBeValidatedArray) {
      if(!namesArray.includes(name)) {
        throw new Error(`"toBeValidatedArray" contains unexpected value: "${name}".`);
      }
    }
  } catch(error) {
    console.error(error);
  }

  function is(str) {
    return toBeValidatedArray.includes(str);
  }

  const obj = args[0];
  
  if(is('primaryContext') && !(obj.primaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"primaryContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, obj.primaryContext);
  }
  if(is('secondaryContext') && !(obj.secondaryContext instanceof CanvasRenderingContext2D)) {
    console.error(`"secondaryContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, obj.secondaryContext);
  }
  if(is('brushContext') && !(obj.brushContext instanceof CanvasRenderingContext2D)) {
    console.error(`"brushContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, obj.brushContext);
  }
  if(is('selectionContext') && !(obj.selectionContext instanceof CanvasRenderingContext2D)) {
    console.error(`"selectionContext" argument has to be an instance of CanvasRenderingContext2D, provided:`, obj.selectionContext);
  }
  if(is('thumbnailPrimaryContext') && !(obj.thumbnailPrimaryContext instanceof CanvasRenderingContext2D) && typeof obj.thumbnailPrimaryContext !== 'undefined') {
    console.error(`"thumbnailPrimaryContext" argument has to be an instance of CanvasRenderingContext2D or undefined, provided:`, obj.thumbnailPrimaryContext);
  }
  if(is('thumbnailSecondaryContext') && !(obj.thumbnailSecondaryContext instanceof CanvasRenderingContext2D) && typeof obj.thumbnailSecondaryContext !== 'undefined') {
    console.error(`"thumbnailSecondaryContext" argument has to be an instance of CanvasRenderingContext2D or undefined, provided:`, obj.thumbnailSecondaryContext);
  }
  if(is('thumbnailSelectionContext') && !(obj.thumbnailSelectionContext instanceof CanvasRenderingContext2D) && typeof obj.thumbnailSelectionContext !== 'undefined') {
    console.error(`"thumbnailSelectionContext" argument has to be an instance of CanvasRenderingContext2D or undefined, provided:`, obj.thumbnailSelectionContext);
  }
  if(is('currentPixel') && (typeof obj.currentPixel !== 'object' || !Number.isInteger(obj.currentPixel?.x) || !Number.isInteger(obj.currentPixel?.y))) {
    console.error(`"currentPixel" argument has to be an object containing properties "x" (integer) and "y" (integer), provided:`, obj.currentPixel);
  }
  if(is('currentlyPressedRef') && (typeof obj.currentlyPressedRef !== 'object' || !Number.isInteger(obj.currentlyPressedRef.current))) {
    console.error(`"currentlyPressedRef" argument has to be an object with "current" property (integer), provided:`, obj.currentlyPressedRef);
  }
  if(is('colorData') && (typeof obj.colorData !== 'object')) {
    console.error(`"colorData" argument has to be an object, provided:`, obj.colorData);
  }
  if(is('setColorData') && (typeof obj.setColorData !== 'function')) {
    console.error(`"setColorData" argument has to be a function, provided:`, obj.setColorData);
  }
  if(is('isRepeated') && (typeof obj.isRepeated !== 'boolean')) {
    console.error(`"isRepeated" argument has to be a boolean value, provided:`, obj.isRepeated);
  }
  if(is('isLast') && (typeof obj.isLast !== 'boolean')) {
    console.error(`"isLast" argument has to be a boolean value, provided:`, obj.isLast);
  }
  if(is('primaryImageData') && (!(obj.primaryImageData instanceof ImageData))) {
    console.error(`"primaryImageData" argument has to be an instance of ImageData, provided:`, obj.primaryImageData);
  }
  if(is('canvasZoom') && typeof obj.canvasZoom !== 'number') {
    console.error(`"canvasZoom" argument has to be a number, provided:`, obj.canvasZoom);
  }
  if(is('selectionSize') && (typeof obj.selectionSize !== 'object' || !Number.isInteger(obj.selectionSize?.width) || !Number.isInteger(obj.selectionSize?.height))) {
    console.error(`"selectionSize" argument has to be an object containing properties "width" (integer) and "height" (integer), provided:`, obj.selectionSize);
  }
  if(is('canvasSize') && (typeof obj.canvasSize !== 'object' || !Number.isInteger(obj.canvasSize?.width) || !Number.isInteger(obj.canvasSize?.height))) {
    console.error(`"canvasSize" argument has to be an object containing properties "width" (integer) and "height" (integer), provided:`, obj.canvasSize);
  }
  if(is('event') && !(obj.event instanceof Event) && !(obj.event.nativeEvent)) {
    console.error(`"event" argument has to be instance of Event or React's SyntheticEvent, provided:`, obj.event);
  }
  if(is('doCanvasChangeZoom') && (typeof obj.doCanvasChangeZoom !== 'function')) {
    console.error(`"doCanvasChangeZoom" argument has to be a function, provided:`, obj.doCanvasChangeZoom);
  }
  if(is('drawCallback') && (typeof obj.drawCallback !== 'function')) {
    console.error(`"drawCallback" argument has to be a function, provided:`, obj.drawCallback);
  }
  if(is('shapeData') && (typeof obj.shapeData !== 'object')) {
    console.error(`"shapeData" argument has to be an object, provided:`, obj.shapeData);
  }
}