import { useState, useEffect, useRef } from 'react';
import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import useResizeCursor from "../../hooks/useResizeCursor";
import usePointerTrack from '../../hooks/usePointerTrack';
import { doGetCanvasCopy } from '../../misc/utils';
import { RGBObjectToString } from '../../misc/utils';

function useSelection({
  primaryRef,
  primaryCtxRef,
  selectionRef,
  selectionCtxRef,
  lastCurrentToolRef,
  lastCanvasZoomRef,
  currentTool,
  canvasZoom,
  colorData,
}) {
  const [selectionResizeData, setSelectionResizeData] = useState(null);
  const [selectionSize, setSelectionSize] = useState(null);
  const [selectionResizedSize, setSelectionResizedSize] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  const [selectionPhase, setSelectionPhase] = useState(0); // 0, 1 or 2
  const lastSelectionStateRef = useRef();
  const lastSelectionSizeRef = useRef(null);
  const lastSelectionPositionRef = useRef(null);
  useResizeCursor(selectionResizeData);

  function doSetSize(newSize) {
    setSelectionSize(newSize);
    setSelectionResizedSize(newSize);
    lastSelectionSizeRef.current = newSize;
  }

  function doSetPosition(newPosition) {
    setSelectionPosition(newPosition);
    lastSelectionPositionRef.current = newPosition;
  }

  const { onPointerDown, doCancel } = usePointerTrack({ 
    onPointerMoveCallback,
    onPointerDownCallback,
    onPointerUpCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });
  
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
    
    const { clientX, clientY } = event;
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = event.pageX - primaryRect.x;
    const offsetY = event.pageY - primaryRect.y;
    
    setSelectionResizeData({
      type: 'selection',
      initialX: clientX,
      initialY: clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY,
      initialWidth: 1,
      initialHeight: 1,
    })
    doSetSize({ width: 1, height: 1 });
    doSetPosition({ x: offsetX, y: offsetY });
    setSelectionPhase(1);
  }
  
  function onPointerMoveCallback(event) {
    let { clientX, clientY } = event;
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = event.pageX - primaryRect.x;
    const offsetY = event.pageY - primaryRect.y;

    let diffX = clientX - selectionResizeData.initialX;
    let diffY = clientY - selectionResizeData.initialY;

    let newWidth = selectionSize.width;
    let newHeight = selectionSize.height;
    let newX = selectionPosition.x;
    let newY = selectionPosition.y;

    newWidth = selectionResizeData.initialWidth + diffX;
    newHeight = selectionResizeData.initialHeight + diffY;
    
    if(newWidth < 0) {
      newWidth *= -1;
      newWidth = Math.min(newWidth, selectionResizeData.initialOffsetX);
      newX = Math.max(offsetX, 0);
    } else {
      newX = selectionResizeData.initialOffsetX;
      newWidth = Math.min(newWidth, primaryRect.width - newX);
    }
    if(newHeight < 0) {
      newHeight *= -1;
      newHeight = Math.min(newHeight, selectionResizeData.initialOffsetY);
      newY = Math.max(offsetY, 0);
    } else {
      newY = selectionResizeData.initialOffsetY;
      newHeight = Math.min(newHeight, primaryRect.height - newY);
    }

    newWidth = Math.max(newWidth, 1);
    newHeight = Math.max(newHeight, 1);

    doSetSize({ width: newWidth, height: newHeight });

    if(newX !== selectionPosition.x || newY !== selectionPosition.y) {
      doSetPosition({ x: newX, y: newY })
    }
  }

  function onPointerUpCallback(event) {
    if(
        selectionResizeData.initialX === event.clientX &&
        selectionResizeData.initialY === event.clientY
      ) {
      setSelectionPhase(0);
      return;
    }
    
    setTimeout(() => {
      /* there was a bug here: if mouse moves too fast this function reads stale width and height,
         that's why timeout is used, if it still happens increasing timeout my help */

      setSelectionPhase(2);
      setSelectionResizeData(null);
  
      const imageData = primaryCtxRef.current.getImageData(
        Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      );
  
      const bufCanvas = document.createElement('canvas');
      bufCanvas.width = Math.round(lastSelectionSizeRef.current.width / canvasZoom);
      bufCanvas.height = Math.round(lastSelectionSizeRef.current.height / canvasZoom);
      bufCanvas.imageSmoothingEnabled = false;
      bufCanvas.getContext('2d').putImageData(imageData, 0, 0);
      
      selectionCtxRef.current.imageSmoothingEnabled = false;
      selectionCtxRef.current.putImageData(imageData, 0, 0);
      lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);

      // scale does not apply to putImageData, so have to use drawImage after copying data
      selectionCtxRef.current.scale(canvasZoom, canvasZoom);
      selectionCtxRef.current.drawImage(bufCanvas, 0, 0);
  
      primaryCtxRef.current.fillStyle = RGBObjectToString(colorData.secondary);
      primaryCtxRef.current.fillRect(
        Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      );
    }, 50);
  }

  function onCancelCallback() {
    setSelectionPhase(0);
    setSelectionResizeData(null);
  }

  function onPointerUpCallbackResize() {
    if(!selectionOutlineSize) {
      return;
    }

    setSelectionResizedSize(selectionOutlineSize);
    setSelectionOutlineSize(null);
  }

  useEffect(() => {
    // redraw always when size changes (as the canvas gets cleared when width or height attribute changes)
    if(selectionPhase === 2 && lastSelectionStateRef.current) {
      selectionCtxRef.current.drawImage(lastSelectionStateRef.current, 0, 0);
    }
  }, [selectionSize, selectionPhase, selectionCtxRef]);
  
  useEffect(() => {
    if(
        lastCurrentToolRef.current === currentTool &&
        lastCanvasZoomRef.current === canvasZoom
      ) {
      return;
    }
    
    if(selectionPhase === 2) {
      primaryCtxRef.current.imageSmoothingEnabled = false;
      primaryCtxRef.current.drawImage(
        doGetCanvasCopy(selectionRef.current),
        Math.round(selectionPosition.x / lastCanvasZoomRef.current),
        Math.round(selectionPosition.y / lastCanvasZoomRef.current),
        Math.round(selectionResizedSize.width / lastCanvasZoomRef.current),
        Math.round(selectionResizedSize.height / lastCanvasZoomRef.current),
      );
    }

    setSelectionPhase(0);
    lastCurrentToolRef.current = currentTool;
    lastCanvasZoomRef.current = canvasZoom;
  }, [currentTool, canvasZoom, selectionPosition, selectionPhase, selectionResizedSize,
      lastCanvasZoomRef, lastCurrentToolRef, primaryCtxRef, selectionRef]
  );

  const { resizeElements: selectionResizeElements } = useResize({ 
    position: selectionPosition,
    setPosition: setSelectionPosition,
    isAllowToLeaveViewport: true,
    size: selectionOutlineSize || selectionResizedSize,
    setSize: setSelectionOutlineSize,
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: false,
    isCancelOnRightMouseDown: true,
    onPointerUpCallback: onPointerUpCallbackResize,
    zoom: 1,
    containerRef: primaryRef
  });
  const { onPointerDownMove: onPointerDownSelectionMove } = useMove({
    position: selectionPosition,
    setPosition: setSelectionPosition,
    size: selectionResizedSize,
    setSize: (newSize) => { setSelectionSize(newSize); setSelectionResizedSize(newSize); },
    isInnerWindow: true,
    isMaximized: false,
    isConstrained: false,
    isReverseConstrained: true,
    containerRef: primaryRef,
  });

  return {
    selectionPhase,
    selectionPosition,
    selectionResizeElements,
    selectionResizedSize,
    selectionSize,
    onPointerDownSelectionMove,
    onPointerDownSelection: onPointerDown,
  }
}

export default useSelection;