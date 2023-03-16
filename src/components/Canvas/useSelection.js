import { useEffect } from 'react';
import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCanvasContext } from '../../context/CanvasContext';

function useSelection() {
  const { primaryRef } = useCanvasContext();
  
  const {
    selectionRef,
    selectionSize,
    selectionPosition,
    selectionOutlineSize, setSelectionOutlineSize,
    selectionPhase,
    lastSelectionStateRef,
    doSelectionSetSize,
    doSelectionResize,
    doSelectionSetPosition,
  } = useSelectionContext();

  const { onPointerDownRectangularSelection } = useRectangularSelection();
  const { onPointerDownFreeFormSelection } = useFreeFormSelection();
  
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