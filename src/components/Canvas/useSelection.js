import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';
import useShape from './useShape';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from "../../context/ToolContext";

function useSelection() {
  const { primaryRef, canvasZoom } = useCanvasContext();
  const { currentTool } = useToolContext();
  
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
  const { onPointerDownShape } = useShape();

  let usedPosition = selectionOutlinePosition || selectionPosition;
  let usedSetPosition = setSelectionOutlinePosition;
  let usedSize = selectionOutlineSize || selectionSize;
  let usedSetSize = setSelectionOutlineSize;

  if(currentTool.startsWith('shape')) {
    usedPosition = selectionPosition;
    usedSetPosition = doSelectionSetPosition;
    usedSize = selectionSize;
    usedSetSize = doSelectionSetSize;
  }
  
  function onPressEndCallbackResize() {
    if(selectionOutlineSize) {
      doSelectionResize({ 
        width: selectionOutlineSize.width / canvasZoom,
        height: selectionOutlineSize.height / canvasZoom
      });
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
    position: usedPosition,
    setPosition: usedSetPosition,
    isAllowToLeaveViewport: true,
    size: usedSize,
    setSize: usedSetSize,
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: false,
    isCancelOnRightMouseDown: true,
    isSmallPoints: true,
    onPressEndCallback: onPressEndCallbackResize,
    zoom: canvasZoom,
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
    canvasZoom,
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
    onPointerDownShape,
  }
}

export default useSelection;