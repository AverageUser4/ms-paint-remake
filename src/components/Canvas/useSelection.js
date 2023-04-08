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
      doSelectionSetPosition({
        x: selectionOutlinePosition.x / canvasZoom,
        y: selectionOutlinePosition.y / canvasZoom,
      });
      setSelectionOutlinePosition(null);
    }
  }
  
  const { 
    resizeGrabElements: selectionResizeGrabElements,
    resizeOutlineElement: selectionResizeOutlineElement
  } = useResize({ 
    position: usedPosition,
    setPosition: usedSetPosition,
    size: usedSize,
    setSize: usedSetSize,
    minimalSize: { width: 1, height: 1, },
    canvasZoom,
    containerRef: primaryRef,
    onPressEndCallback: onPressEndCallbackResize,
    isConstrained: false,
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: false,
    isCancelOnRightMouseDown: true,
    isSmallPoints: true,
    isAllowToLeaveViewport: true,
  });
  
  const { onPointerDownMove: onPointerDownSelectionMove } = useMove({
    position: selectionPosition,
    setPosition: doSelectionSetPosition,
    size: selectionSize,
    setSize: doSelectionSetSize,
    containerRef: primaryRef,
    canvasZoom,
    onMoveCallback: (event) => {
      if(!event.shiftKey) {
        return;
      }

      doSelectionDrawToPrimary(canvasZoom);
    },
    isInnerWindow: true,
    isMaximized: false,
    isConstrained: false,
    isReverseConstrained: true,
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