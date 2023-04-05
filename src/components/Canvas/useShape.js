import { useState, useEffect } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import useResizeCursor from "../../hooks/useResizeCursor";
import { useCanvasContext } from '../../context/CanvasContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useToolContext } from '../../context/ToolContext';
import { useColorContext } from '../../context/ColorContext';

function useShape() {
  const { primaryRef, canvasZoom } = useCanvasContext();
  const { currentTool, currentToolData, shapeData } = useToolContext();
  const { colorData } = useColorContext();

  const {
    selectionSize,
    selectionPosition,
    selectionPhase,
    setSelectionPhase,
    doSelectionDrawToPrimary,
    doSelectionSetSize,
    doSelectionSetPosition,
    doSelectionEnd,
    doSelectionGetEveryContext,
  } = useSelectionContext();

  const [resizeData, setResizeData] = useState(null);
  useResizeCursor(resizeData);

  const { onPointerDown, doCancel, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true,
  });
  
  function onPressStartCallback(event) {
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
  
  function onPressedMoveCallback(event) {
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

  function onPressEndCallback(event) {
    if(
        resizeData.initialX === event.clientX &&
        resizeData.initialY === event.clientY
      ) {
      doSelectionEnd();
      setResizeData(null);
      return;
    }
    
    setTimeout(() => {
      /* there was a bug here: if mouse moves too fast this function reads stale width and height,
         that's why timeout is used, if it still happens increasing timeout my help */

      setSelectionPhase(2);
      setResizeData(null);
      const { selectionContext } = doSelectionGetEveryContext();
      
      currentToolData.drawShape({ 
        selectionContext,
        colorData,
        selectionSize,
        currentlyPressedRef,
        canvasZoom,
        shapeData,
      });
    }, 20);
  }

  function onCancelCallback() {
    doSelectionEnd();
    setResizeData(null);
  }

  useEffect(() => {
    if(!currentTool.startsWith('shape')) {
      return;
    }
    
    const selectionCanvas = document.querySelector('#pxp-selection-canvas');
    if(!selectionCanvas) {
      return;
    }

    function drawCallback() {
      const { selectionContext } = doSelectionGetEveryContext();
        
      currentToolData.drawShape({ 
        selectionContext,
        colorData,
        selectionSize: { 
          width: selectionCanvas.width,
          height: selectionCanvas.height
        },
        currentlyPressedRef,
        canvasZoom,
        shapeData,
      });
    }
    
    drawCallback();
    const observer = new MutationObserver(drawCallback);
    observer.observe(selectionCanvas, { attributes: true, attributeFilter: ['width', 'height'] });

    return () => {
      observer.disconnect();
    };
  });

  return {
    onPointerDownShape: onPointerDown,
  }
}

export default useShape;