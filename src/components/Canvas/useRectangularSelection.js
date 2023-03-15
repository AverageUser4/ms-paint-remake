import { useState } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import useResizeCursor from "../../hooks/useResizeCursor";
import { useCanvasContext } from '../../context/CanvasContext';
import { useHistoryContext } from '../../context/HistoryContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { doGetCanvasCopy } from '../../misc/utils';

function useRectangularSelection() {
  const { 
    primaryRef, doCanvasClearPrimary, canvasSize,
    canvasZoom, doGetEveryContext 
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();

  const {
    selectionSize,
    selectionPosition,
    selectionPhase,
    setSelectionPhase,
    lastSelectionSizeRef,
    lastSelectionPositionRef,
    doSelectionDrawToPrimary,
    doSelectionDrawToSelection,
    doSelectionSetSize,
    doSelectionSetPosition,
    doSelectionEnd,
  } = useSelectionContext();

  const [resizeData, setResizeData] = useState(null);
  useResizeCursor(resizeData);

  const { onPointerDown, doCancel } = usePointerTrack({ 
    onPointerMoveCallback,
    onPointerDownCallback,
    onPointerUpCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
  });
  
  function onPointerDownCallback(event) {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary(canvasZoom);
      doCancel();
      return;
    }
    
    const { clientX, clientY } = event;
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = event.pageX - primaryRect.x;
    const offsetY = event.pageY - primaryRect.y;
    
    setResizeData({
      type: 'selection',
      initialX: clientX,
      initialY: clientY,
      initialOffsetX: offsetX,
      initialOffsetY: offsetY,
      initialWidth: 1,
      initialHeight: 1,
    })
    doSelectionSetSize({ width: 1, height: 1 });
    doSelectionSetPosition({ x: offsetX, y: offsetY });
    setSelectionPhase(1);
  }
  
  function onPointerMoveCallback(event) {
    let { clientX, clientY } = event;
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = event.pageX - primaryRect.x;
    const offsetY = event.pageY - primaryRect.y;

    let diffX = clientX - resizeData.initialX;
    let diffY = clientY - resizeData.initialY;

    let newWidth = selectionSize.width;
    let newHeight = selectionSize.height;
    let newX = selectionPosition.x;
    let newY = selectionPosition.y;

    newWidth = resizeData.initialWidth + diffX;
    newHeight = resizeData.initialHeight + diffY;
    
    if(newWidth < 0) {
      newWidth *= -1;
      newWidth = Math.min(newWidth, resizeData.initialOffsetX);
      newX = Math.max(offsetX, 0);
    } else {
      newX = resizeData.initialOffsetX;
      newWidth = Math.min(newWidth, primaryRect.width - newX);
    }
    if(newHeight < 0) {
      newHeight *= -1;
      newHeight = Math.min(newHeight, resizeData.initialOffsetY);
      newY = Math.max(offsetY, 0);
    } else {
      newY = resizeData.initialOffsetY;
      newHeight = Math.min(newHeight, primaryRect.height - newY);
    }

    newWidth = Math.max(newWidth, 1);
    newHeight = Math.max(newHeight, 1);

    doSelectionSetSize({ width: newWidth, height: newHeight });

    if(newX !== selectionPosition.x || newY !== selectionPosition.y) {
      doSelectionSetPosition({ x: newX, y: newY })
    }
  }

  function onPointerUpCallback(event) {
    if(
        resizeData.initialX === event.clientX &&
        resizeData.initialY === event.clientY
      ) {
      doSelectionEnd();
      return;
    }
    
    setTimeout(() => {
      /* there was a bug here: if mouse moves too fast this function reads stale width and height,
         that's why timeout is used, if it still happens increasing timeout my help */

      setSelectionPhase(2);
      setResizeData(null);

      const { primaryContext } = doGetEveryContext();
  
      const imageData = primaryContext.getImageData(
        Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      );
  
      doSelectionDrawToSelection(imageData);
      doCanvasClearPrimary({
        x: Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        y: Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        width: Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        height: Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      });

      doHistoryAdd({
        element: doGetCanvasCopy(primaryRef.current),
        ...canvasSize,
      });
    }, 20);
  }

  function onCancelCallback() {
    doSelectionEnd();
    setResizeData(null);
  }

  return {
    onPointerDownRectangularSelection: onPointerDown,
  }
}

export default useRectangularSelection;