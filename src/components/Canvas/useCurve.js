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
    doSelectionDrawToSelection, setSelectionPhase, doSelectionSetPosition,
    doSelectionSetSize, selectionPhase, doSelectionDrawToPrimary, doSelectionEnd,
    doSelectionGetEveryContext,
  } = useSelectionContext();

  const { 
    curvePoints, setCurvePoints, currentCurvePointRef,
  } = useCurveContext();

  const { currentTool, shapeData, currentToolData } = useToolContext();
  const { colorData } = useColorContext();
  
  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback,
    onPressStartCallback,
    onPressEndCallback,
    isTrackAlsoRight: true,
  });

  const [isCurveReady, setIsCurveReady] = useState(false);

  function onPressStartCallback(event) {
    if(selectionPhase) {
      doSelectionDrawToPrimary();
      doSelectionEnd();
    }

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

      currentCurvePointRef.current = 2;
      onPressedMoveCallback(event);
    } else if(currentCurvePointRef.current < 4) {
      currentCurvePointRef.current++;
      onPressedMoveCallback(event);
    }
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
    if(currentCurvePointRef.current === 4) {
      currentCurvePointRef.current = 0;
      setIsCurveReady(true);

      setSelectionPhase(2);
      doSelectionSetPosition({ x: 0, y: 0 });
      doSelectionSetSize({ ...canvasSize });
    }
  }

  useEffect(() => {
    if(!isCurveReady) {
      return;
    }
    setIsCurveReady(false);

    doSelectionDrawToSelection(secondaryRef.current);
    doCanvasClearSecondary();
  }, [isCurveReady, doSelectionDrawToSelection, doCanvasClearSecondary, secondaryRef]);

  useEffect(() => {
    if(
        currentTool !== 'shape-curve' ||
        !curvePoints ||
        Math.abs(curvePoints.x1 - curvePoints.x2) + Math.abs(curvePoints.y1 - curvePoints.y2) < 2
      ) {
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
        selectionPhase
      });
    }
  });

  return {
    onPointerDownCurve: onPointerDown,
  };
}

export default useCurve;