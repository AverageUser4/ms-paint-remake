import { useState } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import useResizeCursor from "../../hooks/useResizeCursor";
import { useCanvasContext } from '../../misc/CanvasContext';
import { useHistoryContext } from '../../misc/HistoryContext';
import { useSelectionContext } from '../../misc/SelectionContext';
import { checkArgs, doGetCanvasCopy } from '../../misc/utils';

function useRectangularSelection({
  canvasZoom,
  colorData,
  doSelectionSetSize,
  doSelectionSetPosition,
}) {
  checkArgs([
    { name: 'canvasZoom', value: canvasZoom, type: 'number' },
    { name: 'colorData', value: colorData, type: 'object' },
    { name: 'doSelectionSetSize', value: doSelectionSetSize, type: 'function' },
    { name: 'doSelectionSetPosition', value: doSelectionSetPosition, type: 'function' },
  ]);

  const { primaryRef, clearPrimary, canvasSize } = useCanvasContext();
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
  } = useSelectionContext();

  const [selectionResizeData, setSelectionResizeData] = useState(null);
  useResizeCursor(selectionResizeData);

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
    
    setSelectionResizeData({
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

    let diffX = clientX - selectionResizeData.initialX;
    let diffY = clientY - selectionResizeData.initialY;

    let newWidth = selectionSize.width;
    let newHeight = selectionSize.height;
    let newX = selectionPosition.x;
    let newY = selectionPosition.y;

    newWidth = selectionResizeData.initialWidth + diffX;
    newHeight = selectionResizeData.initialHeight + diffY;
    
    if(newWidth < 0) {
      newWidth *= -1;
      newWidth = Math.min(newWidth, selectionResizeData.initialOffsetX);
      newX = Math.max(offsetX, 0);
    } else {
      newX = selectionResizeData.initialOffsetX;
      newWidth = Math.min(newWidth, primaryRect.width - newX);
    }
    if(newHeight < 0) {
      newHeight *= -1;
      newHeight = Math.min(newHeight, selectionResizeData.initialOffsetY);
      newY = Math.max(offsetY, 0);
    } else {
      newY = selectionResizeData.initialOffsetY;
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
        selectionResizeData.initialX === event.clientX &&
        selectionResizeData.initialY === event.clientY
      ) {
      setSelectionPhase(0);
      return;
    }
    
    setTimeout(() => {
      /* there was a bug here: if mouse moves too fast this function reads stale width and height,
         that's why timeout is used, if it still happens increasing timeout my help */

      setSelectionPhase(2);
      setSelectionResizeData(null);

      const primaryContext = primaryRef.current.getContext('2d');
  
      const imageData = primaryContext.getImageData(
        Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      );
  
      doSelectionDrawToSelection(imageData);
      clearPrimary({
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
    setSelectionPhase(0);
    setSelectionResizeData(null);
  }

  return {
    onPointerDownRectangularSelection: onPointerDown,
  }
}

export default useRectangularSelection;