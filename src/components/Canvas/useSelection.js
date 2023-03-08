import { useEffect } from 'react';
import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import { checkArgs } from '../../misc/utils';
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';
import { useSelectionContext } from '../../misc/SelectionContext';
import { useCanvasContext } from '../../misc/CanvasContext';

function useSelection({
  lastCurrentToolRef,
  lastCanvasZoomRef,
  currentTool,
  canvasZoom,
  colorData,
  lastPointerPositionRef,
  currentToolData,
  canvasSize,
}) {
  checkArgs([
    { name: 'lastCurrentToolRef', value: lastCurrentToolRef, type: 'object' },
    { name: 'lastCanvasZoomRef', value: lastCanvasZoomRef, type: 'object' },
    { name: 'currentTool', value: currentTool, type: 'string' },
    { name: 'colorData', value: colorData, type: 'object' },
    { name: 'canvasZoom', value: canvasZoom, type: 'number' },
    { name: 'lastPointerPositionRef', value: lastPointerPositionRef, type: 'object' },
    { name: 'currentToolData', value: currentToolData, type: 'object' },
    { name: 'canvasSize', value: canvasSize, type: 'object' },
  ]);

  const { primaryRef } = useCanvasContext();
  
  const {
    selectionRef,
    selectionSize,
    selectionPosition,
    selectionOutlineSize, setSelectionOutlineSize,
    selectionPhase, setSelectionPhase,
    lastSelectionStateRef,
    doSelectionSetSize,
    doSelectionResize,
    doSelectionSetPosition,
    doSelectionDrawToPrimary
  } = useSelectionContext();

  const { onPointerDownRectangularSelection } = useRectangularSelection({
    canvasZoom,
    colorData,
    doSelectionSetSize,
    doSelectionSetPosition,
  });

  const { onPointerDownFreeFormSelection } = useFreeFormSelection({
    lastPointerPositionRef,
    currentTool,
    currentToolData,
    canvasZoom,
    canvasSize,
    colorData,
    doSelectionSetSize,
    doSelectionSetPosition,
  });
  
  function onPointerUpCallbackResize() {
    if(!selectionOutlineSize) {
      return;
    }

    doSelectionResize(selectionOutlineSize);
    setSelectionOutlineSize(null);
  }

  useEffect(() => {
    // redraw always when size changes (as the canvas gets cleared when width or height attribute changes)
    if(selectionPhase === 2 && lastSelectionStateRef.current) {
      selectionRef.current.getContext('2d').drawImage(lastSelectionStateRef.current, 0, 0);
    }
  }, [selectionSize, selectionPhase, selectionRef, lastSelectionStateRef]);
  
  useEffect(() => {
    // when zoom or tool changes put current selection where it currently is on primary canvas
    if(
        lastCurrentToolRef.current === currentTool &&
        lastCanvasZoomRef.current === canvasZoom
      ) {
      return;
    }
    
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(lastCanvasZoomRef.current);
    }

    setSelectionPhase(0);
    lastCurrentToolRef.current = currentTool;
    lastCanvasZoomRef.current = canvasZoom;
  }, [currentTool, canvasZoom, selectionPosition, selectionPhase, lastCanvasZoomRef,
      lastCurrentToolRef, primaryRef, selectionRef, setSelectionPhase, doSelectionDrawToPrimary]
  );

  const { resizeElements: selectionResizeElements } = useResize({ 
    position: selectionPosition,
    setPosition: doSelectionSetPosition,
    isAllowToLeaveViewport: true,
    size: selectionOutlineSize || selectionSize,
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
    setPosition: doSelectionSetPosition,
    size: selectionSize,
    setSize: doSelectionSetSize,
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