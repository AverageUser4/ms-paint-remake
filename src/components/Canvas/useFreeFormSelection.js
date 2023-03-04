import { useRef } from "react";
import { RGBObjectToString, doGetCanvasCopy, checkArgs, getDrawData } from "../../misc/utils";
import usePointerTrack from "../../hooks/usePointerTrack";

function useFreeFormSelection({
  primaryRef,
  primaryCtxRef,
  secondaryRef,
  secondaryCtxRef,
  lastPointerPositionRef,
  lastPrimaryStateRef,
  currentTool,
  currentToolData,
  canvasZoom,
  canvasSize,
  colorData,
  doSetSize,
  doSetPosition,
  setSelectionPhase,
  selectionCtxRef
}) {
  checkArgs([
    { name: 'primaryRef', value: primaryRef, type: 'object' },
    { name: 'primaryCtxRef', value: primaryCtxRef, type: 'object' },
    { name: 'currentTool', value: currentTool, type: 'string' },
    { name: 'colorData', value: colorData, type: 'object' },
    { name: 'canvasZoom', value: canvasZoom, type: 'number' },
    { name: 'secondaryRef', value: secondaryRef, type: 'object' },
    { name: 'secondaryCtxRef', value: secondaryCtxRef, type: 'object' },
    { name: 'lastPointerPositionRef', value: lastPointerPositionRef, type: 'object' },
    { name: 'lastPrimaryStateRef', value: lastPrimaryStateRef, type: 'object' },
    { name: 'currentToolData', value: currentToolData, type: 'object' },
    { name: 'canvasSize', value: canvasSize, type: 'object' },
    { name: 'doSetSize', value: doSetSize, type: 'function' },
    { name: 'doSetPosition', value: doSetPosition, type: 'function' },
    { name: 'setSelectionPhase', value: setSelectionPhase, type: 'function' },
    { name: 'selectionCtxRef', value: selectionCtxRef, type: 'object' },
  ]);
  const edgePositionRef = useRef();
  const initialPositionRef = useRef();

  function onPointerDownCallback(event) {
    const { pageX, pageY } = event;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    const offsetX = pageX - secondaryRect.x / canvasZoom;
    const offsetY = pageY - secondaryRect.y / canvasZoom;
    const position = { x: offsetX, y: offsetY };
    edgePositionRef.current = {
      minX: position.x,
      minY: position.y,
      maxX: position.x,
      maxY: position.y,
    };
    initialPositionRef.current = { pageX, pageY, offsetX, offsetY };
  }

  function onPointerMoveCallback(event, TEMPORARY) {
    const step = 1;
    const currentPixel = { ...lastPointerPositionRef.current };

    const { destinationPixel, doDrawLoop, } = getDrawData({
      event, secondaryRef, canvasZoom, currentPixel,
      pagePixel: { x: event.pageX, y: event.pageY },
    });
    
    lastPointerPositionRef.current = { x: destinationPixel.x, y: destinationPixel.y };

    edgePositionRef.current = {
      minX: Math.min(edgePositionRef.current.minX, destinationPixel.x),
      minY: Math.min(edgePositionRef.current.minY, destinationPixel.y),
      maxX: Math.max(edgePositionRef.current.maxX, destinationPixel.x),
      maxY: Math.max(edgePositionRef.current.maxY, destinationPixel.y),
    };

    secondaryCtxRef.current.fillStyle = 'black';
    if(TEMPORARY) {
      secondaryCtxRef.current.fillStyle = 'red';
    }

    function doDraw(isRepeated) {
      currentToolData.draw({
        primaryContext: primaryCtxRef.current,
        secondaryContext: secondaryCtxRef.current,
        currentPixel: { x: Math.round(currentPixel.x), y: Math.round(currentPixel.y) },
        currentlyPressedRef,
        color: { ...colorData },
        isRepeated,
      });
    }

    doDraw(false);
    doDrawLoop(doDraw, step);
  }
  function onPointerUpCallback() {
    onPointerMoveCallback(initialPositionRef.current, true);
    // code below has same bug (line does not fully close, it means that there's something wrong with specified start or destination (not a problem with drawing algorithm))
    // secondaryCtxRef.current.strokeStyle = 'hotpink';
    // secondaryCtxRef.current.beginPath();
    // secondaryCtxRef.current.moveTo(initialPositionRef.current.offsetX, initialPositionRef.current.offsetY);
    // secondaryCtxRef.current.lineTo(lastPointerPositionRef.current.x, lastPointerPositionRef.current.y);
    // secondaryCtxRef.current.stroke();

    lastPointerPositionRef.current = {};

    const x = edgePositionRef.current.minX;
    const y = edgePositionRef.current.minY;
    const width = edgePositionRef.current.maxX - edgePositionRef.current.minX + 1;
    const height = edgePositionRef.current.maxY - edgePositionRef.current.minY + 1;
    
    const imageData = secondaryCtxRef.current.getImageData(x, y, width, height);
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);

    setSelectionPhase(2);
    doSetPosition({ x, y });
    doSetSize({ width, height });

    setTimeout(() => {
      selectionCtxRef.current.putImageData(imageData, 0, 0);
    }, 150);
    // setTimeout(() => {
    //   setSelectionPhase(2);
    //   setSelectionResizeData(null);
  
    //   const imageData = primaryCtxRef.current.getImageData(
    //     Math.round(lastSelectionPositionRef.current.x / canvasZoom),
    //     Math.round(lastSelectionPositionRef.current.y / canvasZoom),
    //     Math.round(lastSelectionSizeRef.current.width / canvasZoom),
    //     Math.round(lastSelectionSizeRef.current.height / canvasZoom),
    //   );
  
    //   const bufCanvas = document.createElement('canvas');
    //   bufCanvas.width = Math.round(lastSelectionSizeRef.current.width / canvasZoom);
    //   bufCanvas.height = Math.round(lastSelectionSizeRef.current.height / canvasZoom);
    //   bufCanvas.imageSmoothingEnabled = false;
    //   bufCanvas.getContext('2d').putImageData(imageData, 0, 0);
      
    //   selectionCtxRef.current.imageSmoothingEnabled = false;
    //   selectionCtxRef.current.putImageData(imageData, 0, 0);
    //   lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);

    //   // scale does not apply to putImageData, so have to use drawImage after copying data
    //   selectionCtxRef.current.scale(canvasZoom, canvasZoom);
    //   selectionCtxRef.current.drawImage(bufCanvas, 0, 0);
  
    //   primaryCtxRef.current.fillStyle = RGBObjectToString(colorData.secondary);
    //   primaryCtxRef.current.fillRect(
    //     Math.round(lastSelectionPositionRef.current.x / canvasZoom),
    //     Math.round(lastSelectionPositionRef.current.y / canvasZoom),
    //     Math.round(lastSelectionSizeRef.current.width / canvasZoom),
    //     Math.round(lastSelectionSizeRef.current.height / canvasZoom),
    //   );
    // }, 50);
  }
  function onCancelCallback() {
    lastPointerPositionRef.current = {};
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPointerMoveCallback,
    onPointerDownCallback,
    onPointerUpCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });

  return { 
    onPointerDownFreeFormSelection: onPointerDown,
  };
}

export default useFreeFormSelection;

