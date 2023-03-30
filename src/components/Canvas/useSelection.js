import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCanvasContext } from '../../context/CanvasContext';

function useSelection() {
  const { primaryRef, canvasZoom } = useCanvasContext();
  
  const {
    selectionSize,
    selectionPosition,
    selectionOutlineSize, setSelectionOutlineSize,
    doSelectionSetSize,
    doSelectionResize,
    doSelectionSetPosition,
    doSelectionDrawToPrimary,
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
    onMoveCallback: (event) => {
      if(!event.shiftKey) {
        return;
      }

      doSelectionDrawToPrimary(canvasZoom);
    }
  });

  return {
    selectionResizeElements,
    onPointerDownSelectionMove,
    onPointerDownRectangularSelection,
    onPointerDownFreeFormSelection,
  }
}

export default useSelection;