import { useState } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import useResizeCursor from "../../hooks/useResizeCursor";
import { doGetCanvasCopy, RGBObjectToString, checkArgs } from '../../misc/utils';

function useRectangularSelection({
  primaryRef,
  primaryCtxRef,
  selectionRef,
  selectionCtxRef,
  canvasZoom,
  colorData,
  selectionSize,
  selectionResizedSize,
  selectionPosition,
  selectionPhase,
  setSelectionPhase,
  lastSelectionStateRef,
  lastSelectionSizeRef,
  lastSelectionPositionRef,
  doSetSize,
  doSetPosition,
}) {
  checkArgs([
    { name: 'primaryRef', value: primaryRef, type: 'object' },
    { name: 'primaryCtxRef', value: primaryCtxRef, type: 'object' },
    { name: 'selectionRef', value: selectionRef, type: 'object' },
    { name: 'selectionCtxRef', value: selectionCtxRef, type: 'object' },
    { name: 'canvasZoom', value: canvasZoom, type: 'number' },
    { name: 'colorData', value: colorData, type: 'object' },
    { name: 'selectionSize', value: selectionSize, type: 'object' },
    { name: 'selectionResizedSize', value: selectionResizedSize, type: 'object' },
    { name: 'selectionPosition', value: selectionPosition, type: 'object' },
    { name: 'selectionPhase', value: selectionPhase, type: 'number' },
    { name: 'setSelectionPhase', value: setSelectionPhase, type: 'function' },
    { name: 'lastSelectionStateRef', value: lastSelectionStateRef, type: 'object' },
    { name: 'lastSelectionSizeRef', value: lastSelectionSizeRef, type: 'object' },
    { name: 'lastSelectionPositionRef', value: lastSelectionPositionRef, type: 'object' },
    { name: 'doSetSize', value: doSetSize, type: 'function' },
    { name: 'doSetPosition', value: doSetPosition, type: 'function' },
  ]);

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
      primaryCtxRef.current.imageSmoothingEnabled = false;
      primaryCtxRef.current.drawImage(
        doGetCanvasCopy(selectionRef.current),
        Math.round(selectionPosition.x / canvasZoom),
        Math.round(selectionPosition.y / canvasZoom),
        Math.round(selectionResizedSize.width / canvasZoom),
        Math.round(selectionResizedSize.height / canvasZoom),
      );
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
  
      const imageData = primaryCtxRef.current.getImageData(
        Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      );
  
      const bufCanvas = document.createElement('canvas');
      bufCanvas.width = Math.round(lastSelectionSizeRef.current.width / canvasZoom);
      bufCanvas.height = Math.round(lastSelectionSizeRef.current.height / canvasZoom);
      bufCanvas.imageSmoothingEnabled = false;
      bufCanvas.getContext('2d').putImageData(imageData, 0, 0);
      
      selectionCtxRef.current.imageSmoothingEnabled = false;
      selectionCtxRef.current.putImageData(imageData, 0, 0);
      lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);

      // scale does not apply to putImageData, so have to use drawImage after copying data
      selectionCtxRef.current.scale(canvasZoom, canvasZoom);
      selectionCtxRef.current.drawImage(bufCanvas, 0, 0);
  
      primaryCtxRef.current.fillStyle = RGBObjectToString(colorData.secondary);
      primaryCtxRef.current.fillRect(
        Math.round(lastSelectionPositionRef.current.x / canvasZoom),
        Math.round(lastSelectionPositionRef.current.y / canvasZoom),
        Math.round(lastSelectionSizeRef.current.width / canvasZoom),
        Math.round(lastSelectionSizeRef.current.height / canvasZoom),
      );
    }, 50);
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