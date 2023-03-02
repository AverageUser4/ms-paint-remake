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
  const [selectionSize, setSelectionSize] = useState({ width: 1, height: 1 });
  const [selectionResizedSize, setSelectionResizedSize] = useState({ width: 1, height: 1 });
  const [selectionPosition, setSelectionPosition] = useState({ x: 50, y: 50 });
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  const [selectionPhase, setSelectionPhase] = useState(0); // 0, 1 or 2
  const lastSelectionStateRef = useRef();
  useResizeCursor(selectionResizeData);

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
    setSelectionSize({ width: 1, height: 1 });
    setSelectionResizedSize({ width: 1, height: 1 });
    setSelectionPosition({ x: offsetX, y: offsetY });
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

    console.log(`setting width to: ${newWidth}`)
    setSelectionSize({ width: newWidth, height: newHeight });
    setSelectionResizedSize({ width: newWidth, height: newHeight });

    if(newX !== selectionPosition.x || newY !== selectionPosition.y) {
      setSelectionPosition({ x: newX, y: newY });
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
    
    console.log(selectionSize.width)
    /*
      - there is a bug here: if mouse moves too fast this function reads stale width and height
      - must make sure that selectionSize is set to latest value before running code below
      - using ref wont work because selectionSize also affects width and height of canvas element
        and drawing to it when it is still smaller causes part of image to be cut off
    */
    
    setSelectionPhase(2);
    setSelectionResizeData(null);

    const imageData = primaryCtxRef.current.getImageData(
      Math.round(selectionPosition.x / canvasZoom),
      Math.round(selectionPosition.y / canvasZoom),
      Math.round(selectionSize.width / canvasZoom),
      Math.round(selectionSize.height / canvasZoom),
    );

    selectionCtxRef.current.imageSmoothingEnabled = false;
    selectionCtxRef.current.scale(canvasZoom, canvasZoom);
    selectionCtxRef.current.putImageData(imageData, 0, 0);
    lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);

    primaryCtxRef.current.fillStyle = 'red'//RGBObjectToString(colorData.secondary);
    primaryCtxRef.current.fillRect(
      Math.round(selectionPosition.x / canvasZoom),
      Math.round(selectionPosition.y / canvasZoom),
      Math.round(selectionSize.width / canvasZoom),
      Math.round(selectionSize.height / canvasZoom),
    );
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

    lastCurrentToolRef.current = currentTool;
    lastCanvasZoomRef.current = canvasZoom;
    
    if(selectionPhase === 2) {
      primaryCtxRef.current.imageSmoothingEnabled = false;
      primaryCtxRef.current.drawImage(
        doGetCanvasCopy(selectionRef.current),
        selectionPosition.x,
        selectionPosition.y,
        selectionResizedSize.width,
        selectionResizedSize.height,
      );
    }
    setSelectionPhase(0);
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
    isInnerWindow: false,
    isMaximized: false,
    isConstrained: false,
    isReverseConstrained: true,
    containerRef: primaryRef,
  });

  const { onPointerDown, doCancel } = usePointerTrack({ 
    onPointerMoveCallback,
    onPointerDownCallback,
    onPointerUpCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
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