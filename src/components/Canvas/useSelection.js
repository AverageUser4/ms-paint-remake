import { useState, useEffect, useRef } from 'react';
import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import { doGetCanvasCopy, checkArgs } from '../../misc/utils';
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';

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

  secondaryRef,
  secondaryCtxRef,
  lastPointerPositionRef,
  lastPrimaryStateRef,
  currentToolData,
  canvasSize,
}) {
  checkArgs([
    { name: 'primaryRef', value: primaryRef, type: 'object' },
    { name: 'primaryCtxRef', value: primaryCtxRef, type: 'object' },
    { name: 'selectionRef', value: selectionRef, type: 'object' },
    { name: 'selectionCtxRef', value: selectionCtxRef, type: 'object' },
    { name: 'lastCurrentToolRef', value: lastCurrentToolRef, type: 'object' },
    { name: 'lastCanvasZoomRef', value: lastCanvasZoomRef, type: 'object' },
    { name: 'currentTool', value: currentTool, type: 'string' },
    { name: 'colorData', value: colorData, type: 'object' },
    { name: 'canvasZoom', value: canvasZoom, type: 'number' },

    { name: 'secondaryRef', value: secondaryRef, type: 'object' },
    { name: 'secondaryCtxRef', value: secondaryCtxRef, type: 'object' },
    { name: 'lastPointerPositionRef', value: lastPointerPositionRef, type: 'object' },
    { name: 'lastPrimaryStateRef', value: lastPrimaryStateRef, type: 'object' },
    { name: 'currentToolData', value: currentToolData, type: 'object' },
    { name: 'canvasSize', value: canvasSize, type: 'object' },
  ]);

  const [selectionSize, setSelectionSize] = useState(null);
  const [selectionResizedSize, setSelectionResizedSize] = useState(null);
  const [selectionPosition, setSelectionPosition] = useState(null);
  const [selectionOutlineSize, setSelectionOutlineSize] = useState(null);
  const [selectionPhase, setSelectionPhase] = useState(0); // 0, 1 or 2
  const lastSelectionStateRef = useRef();
  const lastSelectionSizeRef = useRef(null);
  const lastSelectionPositionRef = useRef(null);

  function doSetSize(newSize) {
    setSelectionSize(newSize);
    setSelectionResizedSize(newSize);
    lastSelectionSizeRef.current = newSize;
  }

  function doSetPosition(newPosition) {
    setSelectionPosition(newPosition);
    lastSelectionPositionRef.current = newPosition;
  }

  const { onPointerDownRectangularSelection } = useRectangularSelection({
    primaryRef,
    primaryCtxRef,
    selectionRef,
    selectionCtxRef,
    canvasZoom,
    colorData,
    selectionSize,
    selectionResizedSize,
    selectionPosition,
    selectionPhase,
    setSelectionPhase,
    lastSelectionStateRef,
    lastSelectionPositionRef,
    lastSelectionSizeRef,
    doSetSize,
    doSetPosition,
  });

  const { onPointerDownFreeFormSelection } = useFreeFormSelection({
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
  });
  
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
    // when zoom or tool changes put current selection where it currently is on primary canvas
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
    setPosition: doSetPosition,
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
    setPosition: doSetPosition,
    size: selectionResizedSize,
    setSize: doSetSize,
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
    onPointerDownRectangularSelection,
    onPointerDownFreeFormSelection,
  }
}

export default useSelection;