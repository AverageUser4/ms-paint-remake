import { useState } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import useResizeCursor from "../../hooks/useResizeCursor";
import { useCanvasContext } from '../../misc/CanvasContext';
import { useSelectionContext } from '../../misc/SelectionContext';
import { RGBObjectToString, checkArgs } from '../../misc/utils';

function useRectangularSelection({
  canvasZoom,
  colorData,
  doSetSize,
  doSetPosition,
}) {
  checkArgs([
    { name: 'canvasZoom', value: canvasZoom, type: 'number' },
    { name: 'colorData', value: colorData, type: 'object' },
    { name: 'doSetSize', value: doSetSize, type: 'function' },
    { name: 'doSetPosition', value: doSetPosition, type: 'function' },
  ]);

  const { primaryRef } = useCanvasContext();

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
    isTrackAlsoRight: true
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
    doSetSize({ width: 1, height: 1 });
    doSetPosition({ x: offsetX, y: offsetY });
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

    doSetSize({ width: newWidth, height: newHeight });

    if(newX !== selectionPosition.x || newY !== selectionPosition.y) {
      doSetPosition({ x: newX, y: newY })
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
  
      primaryContext.fillStyle = RGBObjectToString(colorData.secondary);
      primaryContext.fillRect(
        Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      );
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