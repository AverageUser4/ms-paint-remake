import { useEffect, useState } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from '../../context/ToolContext';
import { useColorContext } from '../../context/ColorContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { usePolygonContext } from '../../context/PolygonContext';

function usePolygon() {
  const { 
    primaryRef, canvasSize, doGetEveryContext, canvasZoom,
    doCanvasClearSecondary, secondaryRef,
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
  
  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    onCancelCallback,
    isTrackAlsoRight: true,
    isCancelOnRightMouseDown: true,
    isWitholdCancel: polygonPoints && (polygonPoints.length > 2)
  });

  const [isPolygonReady, setIsPolygonReady] = useState(false);

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
    if(Math.abs(polygonPoints[0].x - polygonPoints[1].x) + Math.abs(polygonPoints[0].y - polygonPoints[1].y) < 2) {
      doPolygonEnd();
      return;
    }

    // if(currentCurvePointRef.current === 4) {
    //   currentCurvePointRef.current = 0;
    //   setIsPolygonReady(true);

    //   const xArray = Object.keys(curvePoints).filter(key => key.startsWith('x')).map(key => curvePoints[key]);
    //   const yArray = Object.keys(curvePoints).filter(key => key.startsWith('y')).map(key => curvePoints[key]);

    //   const min = {
    //     x: Math.min(...xArray),
    //     y: Math.min(...yArray),
    //   };

    //   const max = {
    //     x: Math.max(...xArray),
    //     y: Math.max(...yArray),
    //   };

    //   const size = {
    //     width: Math.round(max.x - min.x),
    //     height: Math.round(max.y - min.y),
    //   };

    //   setCurvePointPercents({
    //     x1: Math.round((curvePoints.x1 - min.x) / size.width * 100),
    //     x2: Math.round((curvePoints.x2 - min.x) / size.width * 100),
    //     x3: Math.round((curvePoints.x3 - min.x) / size.width * 100),
    //     x4: Math.round((curvePoints.x4 - min.x) / size.width * 100),
    //     y1: Math.round((curvePoints.y1 - min.y) / size.height * 100),
    //     y2: Math.round((curvePoints.y2 - min.y) / size.height * 100),
    //     y3: Math.round((curvePoints.y3 - min.y) / size.height * 100),
    //     y4: Math.round((curvePoints.y4 - min.y) / size.height * 100),
    //   });

    //   setSelectionPhase(2);
    //   doSelectionSetPosition({ 
    //     x: Math.round(min.x - currentToolData.chosenSize / 2),
    //     y: Math.round(min.y - currentToolData.chosenSize / 2),
    //   });
    //   doSelectionSetSize({ 
    //     width: size.width + currentToolData.chosenSize,
    //     height: size.height + currentToolData.chosenSize,
    //   });
    // }
  }

  function onCancelCallback() {
    doPolygonEnd();
    doCanvasClearSecondary();
  }

  useEffect(() => {
    if(!isPolygonReady) {
      return;
    }
    setIsPolygonReady(false);

    doCanvasClearSecondary();
  }, [isPolygonReady, doCanvasClearSecondary, secondaryRef]);

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

    if(currentlyPressedRef.current !== -1) {
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
    }
  });

  return {
    onPointerDownPolygon: onPointerDown,
  };
}

export default usePolygon;