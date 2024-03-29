import { useEffect, useRef } from "react";
import usePointerTrack from "../../hooks/usePointerTrack";
import { useCanvasContext } from "../../context/CanvasContext";
import { useCanvasMiscContext } from "../../context/CanvasMiscContext";
import { useToolContext } from "../../context/ToolContext";
import { useColorContext } from "../../context/ColorContext";
import { useHistoryContext } from "../../context/HistoryContext";
import { useActionsContext } from "../../context/ActionsContext";
import { getDrawData } from "../../misc/utils";

function useBrush() {
  const { 
    primaryRef, secondaryRef, doCanvasDrawImageToPrimary,
    doCanvasClearSecondary, canvasZoom, canvasSize,
    lastPointerPositionRef, doGetEveryContext, brushCanvasRef
  } = useCanvasContext();
  const { canvasMousePosition, canvasOutlineSize } = useCanvasMiscContext();
  const { currentTool, currentToolData } = useToolContext();
  const { colorData, setColorData } = useColorContext();
  const { doHistoryAdd } = useHistoryContext();
  const { doCanvasChangeZoom } = useActionsContext();
  const primaryImageDataRef = useRef();

  useEffect(() => {
    brushCanvasRef.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
  }, [currentTool, brushCanvasRef, canvasSize]);
  
  let usedPressedMoveCallback = onPointerMoveCallback;
  let usedPressStartCallback = onPressStartCallback;
  let usedPressEndCallback = onPressEndCallback;
  let usedCancelCallback = onCancelCallback;

  if(currentToolData.onPointerMove) {
    usedPressedMoveCallback = (event) => currentToolData.onPointerMove({ event });
  }
  if(currentToolData.onPointerDown) {
    usedPressStartCallback = (event) => currentToolData.onPointerDown({
      ...doGetEveryContext(),
      event,
      canvasSize: canvasSize,
      colorData,
      setColorData,
      canvasZoom,
      doCanvasChangeZoom,
    });
  }
  if(currentToolData.onPointerUp) {
    usedPressEndCallback = (event) => currentToolData.onPointerUp({ event });
  }
  if(currentToolData.onCancel) {
    usedCancelCallback = (event) => currentToolData.onCancel({ event });
  }

  function onPressStartCallback(event) {
    if(currentTool === 'eraser') {
      primaryImageDataRef.current = primaryRef.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
    }
    onPointerMoveCallback(event);
  }

  function onPointerMoveCallback(event) {
    const step = currentTool === 'brushes-airbrush' ? 15 : 1;
    const currentPixel = { ...lastPointerPositionRef.current };

    const { destinationPixel, doDrawLoop } = getDrawData({
      secondaryRef, canvasZoom, currentPixel,
      pagePixel: { x: event.pageX, y: event.pageY },
    });

    lastPointerPositionRef.current = { x: destinationPixel.x, y: destinationPixel.y };

    if(currentToolData.doDrawIcon) {
      const { brushContext } = doGetEveryContext();
      brushContext.clearRect(0, 0, canvasSize.width, canvasSize.height);
  
      if(canvasMousePosition && !canvasOutlineSize) {
        currentToolData.doDrawIcon({
          currentPixel: destinationPixel,
          colorData,
          brushContext,
          canvasZoom,
          currentlyPressedRef,
        });
      }
    }

    if(currentlyPressedRef.current === -1) {
      return;
    }

    function doDraw(isRepeated, isLast) {
      currentToolData.draw({
        ...doGetEveryContext(),
        currentPixel: { x: Math.round(currentPixel.x), y: Math.round(currentPixel.y) },
        currentlyPressedRef,
        colorData,
        isRepeated,
        isLast,
        primaryImageData: primaryImageDataRef.current,
      });
    }

    doDrawLoop(doDraw, step);
  }

  function onPressEndCallback() {
    doCanvasDrawImageToPrimary(secondaryRef.current);
    doCanvasClearSecondary();

    doHistoryAdd({ 
      element: primaryRef.current,
      width: canvasSize.width,
      height: canvasSize.height
    });
  }

  function onCancelCallback() {
    doCanvasClearSecondary();
  }

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPressedMoveCallback: usedPressedMoveCallback,
    onEveryMoveCallback: usedPressedMoveCallback,
    onPressStartCallback: usedPressStartCallback,
    onPressEndCallback: usedPressEndCallback,
    onCancelCallback: usedCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });

  return { 
    onPointerDownBrush: onPointerDown,
  };
}

export default useBrush;

