import { useEffect, useRef } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from '../../context/ToolContext';
import { useColorContext } from '../../context/ColorContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { usePolygonContext } from '../../context/PolygonContext';

function usePolygon() {
  const { 
    primaryRef, canvasSize, doGetEveryContext, canvasZoom,
    doCanvasClearSecondary,
  } = useCanvasContext();

  const { 
    setSelectionPhase, doSelectionSetPosition, doSelectionSetSize,
    selectionPhase, doSelectionDrawToPrimary, doSelectionEnd,
    doSelectionGetEveryContext,
  } = useSelectionContext();

  const { 
    polygonPoints, setPolygonPoints, setPolygonPointPercents,
    doPolygonEnd
  } = usePolygonContext();

  const { currentTool, shapeData, currentToolData } = useToolContext();
  const { colorData } = useColorContext();

  const lastClickTimeRef = useRef(0);

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    onCancelCallback,
    isTrackAlsoRight: true,
    isCancelOnRightMouseDown: true,
    isWitholdCancel: polygonPoints && (polygonPoints.length > 2)
  });

  function onPressStartCallback(event) {
    if(selectionPhase) {
      doSelectionDrawToPrimary();
      doSelectionEnd();
    }

    setPolygonPointPercents(null);

    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;
    
    if(!polygonPoints) {
      setPolygonPoints([
        { x: offsetX, y: offsetY },
        { x: offsetX, y: offsetY },
      ]);
    } else {
      setPolygonPoints(prev => [...prev, { x: offsetX, y: offsetY }]);
    }

    onPressedMoveCallback(event);
  }
  
  function onPressedMoveCallback(event) {
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;

    setPolygonPoints(prev => {
      const copy = [...prev];
      const last = { ...copy[copy.length - 1] };
      last.x = offsetX;
      last.y = offsetY;
      copy[copy.length - 1] = last;
      return copy;
    });
  }

  function onPressEndCallback() {
    const currentClickTime = Date.now();

    if(Math.abs(polygonPoints[0].x - polygonPoints[1].x) + Math.abs(polygonPoints[0].y - polygonPoints[1].y) < 2) {
      doPolygonEnd();
      return;
    }

    if(
        polygonPoints.length > 2 &&
        (currentClickTime - lastClickTimeRef.current < 200 ||
        (Math.abs(polygonPoints[0].x - polygonPoints[polygonPoints.length -1].x) < 10 && 
        Math.abs(polygonPoints[0].y - polygonPoints[polygonPoints.length -1].y) < 10))
    ) {
      doPolygonEnd();
      doCanvasClearSecondary();

      const usedPoints = [...polygonPoints];
      usedPoints[usedPoints.length - 1] = usedPoints[0];

      const xArray = usedPoints.map(point => point.x);
      const yArray = usedPoints.map(point => point.y);

      const min = {
        x: Math.min(...xArray),
        y: Math.min(...yArray),
      };

      const max = {
        x: Math.max(...xArray),
        y: Math.max(...yArray),
      };

      const size = {
        width: Math.round(max.x - min.x),
        height: Math.round(max.y - min.y),
      };

      const percents = [];
      for(let point of usedPoints) {
        percents.push({
          x: Math.round((point.x - min.x) / size.width * 100),
          y: Math.round((point.y - min.y) / size.height * 100),
        });
      }

      setPolygonPointPercents(percents);

      setSelectionPhase(2);
      doSelectionSetPosition({ 
        x: Math.round(min.x - currentToolData.chosenSize / 2),
        y: Math.round(min.y - currentToolData.chosenSize / 2),
      });
      doSelectionSetSize({ 
        width: size.width + currentToolData.chosenSize,
        height: size.height + currentToolData.chosenSize,
      });
    }

    lastClickTimeRef.current = currentClickTime;
  }

  function onCancelCallback() {
    doPolygonEnd();
    doCanvasClearSecondary();
  }

  useEffect(() => {
    if(
        currentTool !== 'shape-polygon' ||
        !polygonPoints
      ) {
      return;
    }

    if(Math.abs(polygonPoints[0].x - polygonPoints[1].x) + Math.abs(polygonPoints[0].y - polygonPoints[1].y) < 2) {
      doCanvasClearSecondary();
      return;
    }

    currentToolData.drawShape({ 
      ...doGetEveryContext(),
      ...doSelectionGetEveryContext(),
      colorData,
      canvasSize,
      currentlyPressedRef,
      shapeData,
      polygonPoints,
      selectionPhase,
    });
  });

  return {
    onPointerDownPolygon: onPointerDown,
  };
}

export default usePolygon;