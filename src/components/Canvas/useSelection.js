import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';
import useShapeSelection from './useShapeSelection';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCanvasContext } from '../../context/CanvasContext';

function useSelection() {
  const { primaryRef, canvasZoom } = useCanvasContext();
  
  const {
    selectionSize,
    selectionPosition,
    selectionOutlineSize, setSelectionOutlineSize,
    selectionOutlinePosition, setSelectionOutlinePosition,
    doSelectionSetSize,
    doSelectionResize,
    doSelectionSetPosition,
    doSelectionDrawToPrimary,
  } = useSelectionContext();

  const { onPointerDownRectangularSelection } = useRectangularSelection();
  const { onPointerDownFreeFormSelection } = useFreeFormSelection();
  const { onPointerDownShapeSelection } = useShapeSelection();
  
  function onPressEndCallbackResize() {
    if(selectionOutlineSize) {
      doSelectionResize(selectionOutlineSize);
      setSelectionOutlineSize(null);
    }

    if(selectionOutlinePosition) {
      doSelectionSetPosition(selectionOutlinePosition);
      setSelectionOutlinePosition(null);
    }
  }
  
  const { 
    resizeGrabElements: selectionResizeGrabElements,
    resizeOutlineElement: selectionResizeOutlineElement
  } = useResize({ 
    position: selectionOutlinePosition || selectionPosition,
    setPosition: setSelectionOutlinePosition,
    isAllowToLeaveViewport: true,
    size: selectionOutlineSize || selectionSize,
    setSize: setSelectionOutlineSize,
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: false,
    isCancelOnRightMouseDown: true,
    isSmallPoints: true,
    onPressEndCallback: onPressEndCallbackResize,
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
    selectionResizeGrabElements,
    selectionResizeOutlineElement,
    onPointerDownSelectionMove,
    onPointerDownRectangularSelection,
    onPointerDownFreeFormSelection,
    onPointerDownShapeSelection,
  }
}

export default useSelection;