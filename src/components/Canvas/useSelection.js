import { useEffect } from 'react';
import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import { checkArgs } from '../../misc/utils';
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';
import { useSelectionContext } from '../../misc/SelectionContext';

function useSelection({
  primaryRef,
  primaryCtxRef,
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

  const {
    selectionRef,
    selectionCtxRef,
    selectionSize,
    selectionResizedSize, setSelectionResizedSize,
    selectionPosition,
    selectionOutlineSize, setSelectionOutlineSize,
    selectionPhase, setSelectionPhase,
    lastSelectionStateRef,
    doSetSize,
    doSetPosition,
    doSelectionDrawToPrimary
  } = useSelectionContext();

  const { onPointerDownRectangularSelection } = useRectangularSelection({
    primaryRef,
    primaryCtxRef,
    canvasZoom,
    colorData,
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
  }, [selectionSize, selectionPhase, selectionCtxRef, lastSelectionStateRef]);
  
  useEffect(() => {
    // when zoom or tool changes put current selection where it currently is on primary canvas
    if(
        lastCurrentToolRef.current === currentTool &&
        lastCanvasZoomRef.current === canvasZoom
      ) {
      return;
    }
    
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(primaryCtxRef.current, lastCanvasZoomRef.current);
    }

    setSelectionPhase(0);
    lastCurrentToolRef.current = currentTool;
    lastCanvasZoomRef.current = canvasZoom;
  }, [currentTool, canvasZoom, selectionPosition, selectionPhase, selectionResizedSize,
      lastCanvasZoomRef, lastCurrentToolRef, primaryCtxRef, selectionRef, setSelectionPhase, doSelectionDrawToPrimary]
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
    selectionResizeElements,
    onPointerDownSelectionMove,
    onPointerDownRectangularSelection,
    onPointerDownFreeFormSelection,
  }
}

export default useSelection;