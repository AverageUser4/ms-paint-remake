import useMove from "../../hooks/useMove";
import useResize from "../../hooks/useResize";
import useRectangularSelection from './useRectangularSelection';
import useFreeFormSelection from './useFreeFormSelection';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from "../../context/ToolContext";
import { MAX_CANVAS_SIZE } from "../../misc/data";

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
    selectionPhase,
  } = useSelectionContext();

  const { onPointerDownRectangularSelection } = useRectangularSelection();
  const { onPointerDownFreeFormSelection } = useFreeFormSelection();

  let usedPositionMove = selectionPosition;
  let usedSetPositionMove = doSelectionSetPosition;
  let usedSizeMove = selectionSize;
  let usedSetSizeMove = doSelectionSetSize;

  let usedPositionResize = selectionOutlinePosition || selectionPosition;
  let usedSetPositionResize = setSelectionOutlinePosition;
  let usedSizeResize = selectionOutlineSize || selectionSize;
  let usedSetSizeResize = setSelectionOutlineSize;

  if(!selectionPhase) {
    usedPositionMove = { x: 0, y: 0 };
    usedSetPositionMove = () => 0;
    usedSizeMove = { width: 0, heigth: 0 };
    usedSetSizeMove = () => 0;
    usedPositionResize = { x: 0, y: 0 };
    usedSetPositionResize = () => 0;
    usedSizeResize = { width: 0, heigth: 0 };
    usedSetSizeResize = () => 0;
  } else if(currentTool.startsWith('shape')) {
    usedPositionResize = selectionPosition;
    usedSetPositionResize = (position) => {
      position = { ...position };
      position.x = Math.round(position.x / canvasZoom);
      position.y = Math.round(position.y / canvasZoom);
      doSelectionSetPosition(position);
    };
    usedSizeResize = selectionSize;
    usedSetSizeResize = (size) => {
      size = { ...size };
      size.width = Math.round(size.width / canvasZoom);
      size.height = Math.round(size.height / canvasZoom);
      doSelectionSetSize(size);
    };
  }
  
  function onPressEndCallbackResize() {
    if(selectionOutlineSize) {
      doSelectionResize({ 
        width: Math.round(Math.max(selectionOutlineSize.width / canvasZoom, 1)),
        height: Math.round(Math.max(selectionOutlineSize.height / canvasZoom, 1))
      });
      setSelectionOutlineSize(null);
    }

    if(selectionOutlinePosition) {
      doSelectionSetPosition({
        x: Math.round(selectionOutlinePosition.x / canvasZoom),
        y: Math.round(selectionOutlinePosition.y / canvasZoom),
      });
      setSelectionOutlinePosition(null);
    }
  }
  
  const { 
    resizeGrabElements: selectionResizeGrabElements,
    resizeOutlineElement: selectionResizeOutlineElement
  } = useResize({ 
    position: usedPositionResize,
    setPosition: usedSetPositionResize,
    size: usedSizeResize,
    setSize: usedSetSizeResize,
    minimalSize: { width: 1, height: 1, },
    maximalSize: { 
      width: MAX_CANVAS_SIZE * canvasZoom,
      height: MAX_CANVAS_SIZE * canvasZoom 
    },
    canvasZoom,
    containerRef: primaryRef,
    onPressEndCallback: onPressEndCallbackResize,
    isResizable: true,
    isPointBased: true,
    isCancelOnRightMouseDown: true,
    isSmallPoints: true,
    isAllowToLeaveViewport: true,
  });
  
  const { onPointerDownMove: onPointerDownSelectionMove } = useMove({
    position: usedPositionMove,
    setPosition: usedSetPositionMove,
    size: usedSizeMove,
    setSize: usedSetSizeMove,
    containerRef: primaryRef,
    canvasZoom,
    onMoveCallback: (event) => {
      if(!event.shiftKey) {
        return;
      }

      doSelectionDrawToPrimary();
    },
    isReverseConstrained: true,
  });

  return {
    selectionResizeGrabElements,
    selectionResizeOutlineElement,
    onPointerDownSelectionMove,
    onPointerDownRectangularSelection,
    onPointerDownFreeFormSelection,
  }
}

export default useSelection;