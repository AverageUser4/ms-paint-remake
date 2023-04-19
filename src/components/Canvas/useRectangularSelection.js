import { useState, useEffect, useCallback } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import useUnchangingCursor from "../../hooks/useUnchangingCursor";
import { useCanvasContext } from '../../context/CanvasContext';
import { useHistoryContext } from '../../context/HistoryContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useColorContext } from '../../context/ColorContext';
import { useToolContext } from '../../context/ToolContext';
import { objectEquals } from '../../misc/utils';
import { useCurveContext } from '../../context/CurveContext';
import { usePolygonContext } from '../../context/PolygonContext';

function useRectangularSelection() {
  const { 
    primaryRef, doCanvasClearPrimary, canvasSize,
    canvasZoom, doGetEveryContext 
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { currentTool, currentToolData, shapeData } = useToolContext();
  const { colorData } = useColorContext();
  const { curvePoints, currentCurvePointRef, curvePointPercents } = useCurveContext();
  const { polygonPoints, polygonPointPercents } = usePolygonContext();

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
    doSelectionGetEveryContext,
  } = useSelectionContext();

  const [resizeData, setResizeData] = useState(null);
  useUnchangingCursor(resizeData);
  const [isResizingDone, setIsResizingDone] = useState(false);

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true,
  });

  const drawCallback = useCallback(() => {
    currentToolData.drawShape({
      ...doGetEveryContext(),
      ...doSelectionGetEveryContext(),
      colorData,
      selectionSize,
      currentlyPressedRef,
      shapeData,
      canvasSize,
      curvePoints,
      currentCurvePointRef,
      selectionPhase,
      curvePointPercents,
      polygonPoints,
      polygonPointPercents,
    });
  }, [
    colorData,
    selectionSize,
    currentlyPressedRef,
    shapeData,
    currentToolData,
    doSelectionGetEveryContext,
    canvasSize,
    curvePoints,
    currentCurvePointRef,
    doGetEveryContext,
    selectionPhase,
    curvePointPercents,
  ]);
  
  function onPressStartCallback(event) {
    if(selectionPhase === 2) {
      doSelectionDrawToPrimary();
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
    doSelectionSetPosition({ 
      x: Math.round(offsetX / canvasZoom),
      y: Math.round(offsetY / canvasZoom) 
    });
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

    doSelectionSetSize({ 
      width: Math.round(newWidth / canvasZoom),
      height: Math.round(newHeight / canvasZoom) 
    });

    if(newX !== selectionPosition.x || newY !== selectionPosition.y) {
      doSelectionSetPosition({ 
        x: Math.round(newX / canvasZoom),
        y: Math.round(newY / canvasZoom) 
      });
    }
  }

  function onPressEndCallback() {
    if(
        lastSelectionSizeRef.current.width < 2 ||
        lastSelectionSizeRef.current.height < 2
      ) {
      doSelectionEnd();
      setResizeData(null);
      return;
    }

    setIsResizingDone(true);
  }

  function onCancelCallback() {
    doSelectionEnd();
    setResizeData(null);
  }

  useEffect(() => {
    if(
      !isResizingDone ||
      !objectEquals(lastSelectionPositionRef.current, selectionPosition) ||
      !objectEquals(lastSelectionSizeRef.current, selectionSize)
    ) {
      return;
    }

    setIsResizingDone(false);

    setSelectionPhase(2);
    setResizeData(null);

    if(currentTool.startsWith('selection')) {
      const { primaryContext } = doGetEveryContext();
  
      const size = {
        width: Math.max(1, lastSelectionSizeRef.current.width),
        height: Math.max(1, lastSelectionSizeRef.current.height),
      };

      const imageData = primaryContext.getImageData(
        lastSelectionPositionRef.current.x,
        lastSelectionPositionRef.current.y,
        size.width,
        size.height,
      );

      doSelectionDrawToSelection(imageData);
      doCanvasClearPrimary({
        x: lastSelectionPositionRef.current.x,
        y: lastSelectionPositionRef.current.y,
        ...size,
      });

      doHistoryAdd({
        element: primaryRef.current,
        ...canvasSize,
      });
    }
  });

  useEffect(() => {
    if(!currentTool.startsWith('shape') || !selectionPhase) {
      return;
    }

    drawCallback();
  }, [currentTool, drawCallback, selectionPhase]);

  useEffect(() => {
    if(!currentTool.startsWith('shape') || !selectionPhase) {
      return;
    }
    
    const selectionCanvas = document.querySelector('#pxp-selection-canvas');
    const observer = new MutationObserver(drawCallback);
    observer.observe(selectionCanvas, { attributes: true, attributeFilter: ['width', 'height'] });

    return () => {
      observer.disconnect();
    };
  });

  return {
    onPointerDownRectangularSelection: onPointerDown,
  }
}

export default useRectangularSelection;