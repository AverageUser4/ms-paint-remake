import { useState, useEffect } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from '../../context/ToolContext';
import { useColorContext } from '../../context/ColorContext';

function useCurve() {
  const { 
    primaryRef, canvasSize, doGetEveryContext, canvasZoom,
    doCanvasClearSecondary,
  } = useCanvasContext();

  const { currentTool, shapeData, currentToolData } = useToolContext();
  const { colorData } = useColorContext();
  const [curvePoints, setCurvePoints] = useState(null);
  const [currentPoint, setCurrentPoint] = useState(0);
  
  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    isTrackAlsoRight: true,
  });
  
  function onPressStartCallback(event) {
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;
    
    if(!currentPoint) {
      setCurvePoints({
        x1: offsetX, y1: offsetY,
        x2: offsetX, y2: offsetY,
        x3: offsetX, y3: offsetY,
        x4: offsetX, y4: offsetY,
      });

      setCurrentPoint(1);
    } else if(currentPoint < 4) {
      setCurrentPoint(prev => prev + 1);
    } else {
      setCurrentPoint(0);
    }
  }
  
  function onPressedMoveCallback(event) {
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;

    setCurvePoints(prev => ({ 
      ...prev,
      [`x${currentPoint}`]: offsetX,
      [`y${currentPoint}`]: offsetY
    }));
  }

  function onPressEndCallback() {

  }

  useEffect(() => {
    if(
        currentTool !== 'shape-curve' ||
        !curvePoints ||
        Math.abs(curvePoints.x1 - curvePoints.x2) + Math.abs(curvePoints.y1 - curvePoints.y2) < 2
      ) {
      return;
    }

    if(currentlyPressedRef.current !== -1 || currentPoint) {
      currentToolData.drawShape({ 
        ...doGetEveryContext(),
        colorData,
        canvasSize,
        currentlyPressedRef,
        shapeData,
        curvePoints,
      });
    }
  });

  return {
    onPointerDownCurve: onPointerDown,
  };
}

export default useCurve;