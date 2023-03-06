import { useRef } from "react";
import { ImageDataUtils, checkArgs, getDrawData } from "../../misc/utils";
import usePointerTrack from "../../hooks/usePointerTrack";
import { useSelectionContext } from "../../misc/SelectionContext";

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
  ]);

  const {
    setSelectionPhase,
    selectionCtxRef,
    lastSelectionStateRef,
    selectionPhase,
    doSelectionDrawToPrimary,
    doSelectionDrawToSelection
  } = useSelectionContext();

  const edgePositionRef = useRef();
  const initialPositionRef = useRef();
  const primaryImageDataRef = useRef();

  function onPointerDownCallback(event) {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(primaryCtxRef.current, canvasZoom);
      doCancel();
      return;
    }

    primaryImageDataRef.current = primaryCtxRef.current.getImageData(
      0, 0, primaryRef.current.width, primaryRef.current.height);
    const { pageX, pageY } = event;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    const offsetX = Math.round((pageX - secondaryRect.x) / canvasZoom);
    const offsetY = Math.round((pageY - secondaryRect.y) / canvasZoom);
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
      isConstrained: true,
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
        primaryImageData: primaryImageDataRef.current,
        isRepeated,
      });
    }

    doDraw(false);
    doDrawLoop(doDraw, step);
  }
  function onPointerUpCallback() {
    onPointerMoveCallback(initialPositionRef.current, true);
    lastPointerPositionRef.current = {};

    const x = Math.round(edgePositionRef.current.minX);
    const y = Math.round(edgePositionRef.current.minY);
    const width = Math.round(edgePositionRef.current.maxX - edgePositionRef.current.minX + 1);
    const height = Math.round(edgePositionRef.current.maxY - edgePositionRef.current.minY + 1);

    const zoomedX = Math.round(x * canvasZoom);
    const zoomedY = Math.round(y * canvasZoom);
    const zoomedWidth = Math.round(width * canvasZoom);
    const zoomedHeight = Math.round(height * canvasZoom);

    const boundariesImageData = secondaryCtxRef.current.getImageData(x, y, width, height);
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
    lastSelectionStateRef.current = null;

    if(width < 6 || height < 6) {
      return;
    }

    doSetPosition({ x: zoomedX, y: zoomedY });
    doSetSize({ width: zoomedWidth, height: zoomedHeight });
    setSelectionPhase(2);

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
      }

      doSelectionDrawToSelection(selectionImageData, canvasZoom);

      primaryCtxRef.current.putImageData(primaryImageData, x, y);
    }, 20);
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

