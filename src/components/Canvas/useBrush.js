import usePointerTrack from "../../hooks/usePointerTrack";
import { useCanvasContext } from "../../context/CanvasContext";
import { RGBObjectToString, doGetCanvasCopy, getDrawData } from "../../misc/utils";

function useBrush({
  lastPointerPositionRef,
  currentTool,
  currentToolData,
  canvasZoom,
  setCanvasZoom,
  canvasSize,
  colorData,
  setColorData,
  doHistoryAdd,
}) {
  const { primaryRef, secondaryRef, lastPrimaryStateRef } = useCanvasContext();
  
  let usedMoveCallback = onPointerMoveCallback;
  let usedDownCallback = onPointerMoveCallback;
  let usedUpCallback = onPointerUpCallback;
  let usedCancelCallback = onCancelCallback;

  if(currentToolData.onPointerMove) {
    usedMoveCallback = (event) => currentToolData.onPointerMove({ event });
  }
  if(currentToolData.onPointerDown) {
    usedDownCallback = (event) => currentToolData.onPointerDown({
      event,
      currentZoom: canvasZoom,
      primaryContext: primaryRef.current.getContext('2d'),
      canvasSize: canvasSize,
      colorData,
      setColorData,
      canvasZoom,
      setCanvasZoom
    });
  }
  if(currentToolData.onPointerUp) {
    usedUpCallback = (event) => currentToolData.onPointerUp({ event });
  }
  if(currentToolData.onCancel) {
    usedCancelCallback = (event) => currentToolData.onCancel({ event });
  }

  function onPointerMoveCallback(event) {
    const step = currentTool === 'airbrush' ? 5 : 1;
    const currentPixel = { ...lastPointerPositionRef.current };

    const { destinationPixel, doDrawLoop, } = getDrawData({
      event, secondaryRef, canvasZoom, currentPixel,
      pagePixel: { x: event.pageX, y: event.pageY },
    });

    lastPointerPositionRef.current = { x: destinationPixel.x, y: destinationPixel.y };

    const primaryContext = primaryRef.current.getContext('2d');
    const secondaryContext = secondaryRef.current.getContext('2d');
    
    secondaryContext.fillStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);
    secondaryContext.strokeStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);

    function doDraw(isRepeated) {
      currentToolData.draw({
        primaryContext,
        secondaryContext,
        currentPixel: { x: Math.round(currentPixel.x), y: Math.round(currentPixel.y) },
        currentlyPressedRef,
        color: { ...colorData },
        isRepeated,
      });
    }

    doDraw(false);
    doDrawLoop(doDraw, step);
  }

  function onPointerUpCallback() {
    lastPointerPositionRef.current = {};

    primaryRef.current.getContext('2d').drawImage(secondaryRef.current, 0, 0);
    secondaryRef.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);

    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
    doHistoryAdd({ 
      element: doGetCanvasCopy(primaryRef.current),
      width: canvasSize.width,
      height: canvasSize.height
    });
  }

  function onCancelCallback() {
    lastPointerPositionRef.current = {};
    secondaryRef.current.getContext('2d').clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPointerMoveCallback: usedMoveCallback,
    onPointerDownCallback: usedDownCallback,
    onPointerUpCallback: usedUpCallback,
    onCancelCallback: usedCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });

  return { 
    onPointerDownBrush: onPointerDown,
  };
}

export default useBrush;

