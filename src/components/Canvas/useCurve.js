import { useEffect, useState } from 'react';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useCanvasContext } from '../../context/CanvasContext';
import { useToolContext } from '../../context/ToolContext';
import { useColorContext } from '../../context/ColorContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCurveContext } from '../../context/CurveContext';

function useCurve() {
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
    curvePoints, setCurvePoints, currentCurvePointRef, setCurvePointPercents,
    doCurveEnd
  } = useCurveContext();

  const { currentTool, shapeData, currentToolData } = useToolContext();
  const { colorData } = useColorContext();
  
  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    onCancelCallback,
    isTrackAlsoRight: true,
    isCancelOnRightMouseDown: true,
    isWitholdCancel: currentCurvePointRef.current > 2
  });

  const [isCurveReady, setIsCurveReady] = useState(false);

  function onPressStartCallback(event) {
    if(selectionPhase) {
      doSelectionDrawToPrimary();
      doSelectionEnd();
    }

    setCurvePointPercents(null);

    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;
    
    if(!currentCurvePointRef.current) {
      setCurvePoints({
        x1: offsetX, y1: offsetY,
        x2: offsetX, y2: offsetY,
        x3: offsetX, y3: offsetY,
        x4: offsetX, y4: offsetY,
      });

      currentCurvePointRef.current = 1;
    }

    currentCurvePointRef.current++;
    onPressedMoveCallback(event);
  }
  
  function onPressedMoveCallback(event) {
    const primaryRect = primaryRef.current.getBoundingClientRect();
    const offsetX = Math.round(event.pageX - primaryRect.x) / canvasZoom;
    const offsetY = Math.round(event.pageY - primaryRect.y) / canvasZoom;

    setCurvePoints(prev => ({ 
      ...prev,
      [`x${currentCurvePointRef.current}`]: offsetX,
      [`y${currentCurvePointRef.current}`]: offsetY
    }));
  }

  function onPressEndCallback() {
    if(Math.abs(curvePoints.x1 - curvePoints.x2) + Math.abs(curvePoints.y1 - curvePoints.y2) < 2) {
      doCurveEnd();
      return;
    }

    if(currentCurvePointRef.current === 4) {
      currentCurvePointRef.current = 0;
      setIsCurveReady(true);

      const xArray = Object.keys(curvePoints).filter(key => key.startsWith('x')).map(key => curvePoints[key]);
      const yArray = Object.keys(curvePoints).filter(key => key.startsWith('y')).map(key => curvePoints[key]);

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

      setCurvePointPercents({
        x1: Math.round((curvePoints.x1 - min.x) / size.width * 100),
        x2: Math.round((curvePoints.x2 - min.x) / size.width * 100),
        x3: Math.round((curvePoints.x3 - min.x) / size.width * 100),
        x4: Math.round((curvePoints.x4 - min.x) / size.width * 100),
        y1: Math.round((curvePoints.y1 - min.y) / size.height * 100),
        y2: Math.round((curvePoints.y2 - min.y) / size.height * 100),
        y3: Math.round((curvePoints.y3 - min.y) / size.height * 100),
        y4: Math.round((curvePoints.y4 - min.y) / size.height * 100),
      });

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
  }

  function onCancelCallback() {
    doCurveEnd();
    doCanvasClearSecondary();
  }

  useEffect(() => {
    if(!isCurveReady) {
      return;
    }
    setIsCurveReady(false);

    doCanvasClearSecondary();
  }, [isCurveReady, doCanvasClearSecondary, secondaryRef]);

  useEffect(() => {
    if(
        currentTool !== 'shape-curve' ||
        !curvePoints
      ) {
      return;
    }

    if(Math.abs(curvePoints.x1 - curvePoints.x2) + Math.abs(curvePoints.y1 - curvePoints.y2) < 2) {
      doCanvasClearSecondary();
      return;
    }

    if(currentlyPressedRef.current !== -1 || currentCurvePointRef.current) {
      currentToolData.drawShape({ 
        ...doGetEveryContext(),
        ...doSelectionGetEveryContext(),
        colorData,
        canvasSize,
        currentlyPressedRef,
        shapeData,
        curvePoints,
        currentCurvePointRef,
        selectionPhase,
      });
    }
  });

  return {
    onPointerDownCurve: onPointerDown,
  };
}

export default useCurve;