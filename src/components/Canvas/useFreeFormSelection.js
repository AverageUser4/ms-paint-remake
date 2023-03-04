import { useRef } from "react";
import { ImageDataUtils, checkArgs, getDrawData, doGetCanvasCopy } from "../../misc/utils";
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
  selectionCtxRef,
  lastSelectionStateRef,
  selectionPhase,
  selectionRef,
  selectionPosition,
  selectionResizedSize
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
    { name: 'lastSelectionStateRef', value: lastSelectionStateRef, type: 'object' },
    { name: 'selectionPhase', value: selectionPhase, type: 'number' },
    { name: 'selectionRef', value: selectionRef, type: 'object' },
    { name: 'selectionPosition', value: selectionPosition, type: 'object' },
    { name: 'selectionResizedSize', value: selectionResizedSize, type: 'object' },
  ]);
  const edgePositionRef = useRef();
  const initialPositionRef = useRef();

  function onPointerDownCallback(event) {
    if(selectionPhase === 2) {
      primaryCtxRef.current.imageSmoothingEnabled = false;
      primaryCtxRef.current.drawImage(
        doGetCanvasCopy(selectionRef.current),
        Math.round(selectionPosition.x / canvasZoom),
        Math.round(selectionPosition.y / canvasZoom),
        Math.round(selectionResizedSize.width / canvasZoom),
        Math.round(selectionResizedSize.height / canvasZoom),
      );
      doCancel();
      return;
    }

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

    onPointerMoveCallback(event);
  }

  function onPointerMoveCallback(event) {
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
    lastPointerPositionRef.current = {};

    const x = edgePositionRef.current.minX;
    const y = edgePositionRef.current.minY;
    const width = edgePositionRef.current.maxX - edgePositionRef.current.minX + 1;
    const height = edgePositionRef.current.maxY - edgePositionRef.current.minY + 1;

    const boundariesImageData = secondaryCtxRef.current.getImageData(x, y, width, height);
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
    lastSelectionStateRef.current = null;

    if(width < 6 || height < 6) {
      return;
    }

    setSelectionPhase(2);
    doSetPosition({ x, y });
    doSetSize({ width, height });

    setTimeout(() => {
      const primaryImageData = primaryCtxRef.current.getImageData(x, y, width, height);
      const selectionImageData = selectionCtxRef.current.getImageData(x, y, width, height);
      
      function isThereTerminatingLine(column, row) {
        for(let i = column + 2; i < width; i++) {
          const isBlack = ImageDataUtils.getColorFromCoords(boundariesImageData, i, row).a > 0;
          if(isBlack) {
            return true;
          }
        }
        return false;
      }
      
      for(let row = 0; row < height; row++) {
        let isWithinLine = false;

        for(let column = 0; column < width; column++) {
          const isBlack = ImageDataUtils.getColorFromCoords(boundariesImageData, column, row).a > 0;
          const isNextBlack = column === width - 1 ? false : ImageDataUtils.getColorFromCoords(boundariesImageData, column + 1, row).a > 0;

          if(isWithinLine && isNextBlack) {
              isWithinLine = false;
          } else if(!isWithinLine && isBlack && !isNextBlack) {
            if(isThereTerminatingLine(column, row)) {
              isWithinLine = true;
            }
          }
          
          if(isWithinLine) {
            const primaryColor = ImageDataUtils.getColorFromCoords(primaryImageData, column, row);
            ImageDataUtils.setColorAtCoords(selectionImageData, column, row, primaryColor);
            ImageDataUtils.setColorAtCoords(primaryImageData, column, row, colorData.secondary);
          }
        }

        primaryCtxRef.current.putImageData(primaryImageData, x, y);
        selectionCtxRef.current.putImageData(selectionImageData, 0, 0);
      }
    }, 50);
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
    setSelectionPhase(0);
    lastPointerPositionRef.current = {};
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  const { onPointerDown, currentlyPressedRef, doCancel } = usePointerTrack({ 
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

