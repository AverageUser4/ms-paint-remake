import { RGBObjectToString } from "../../misc/utils";
import usePointerTrack from "../../hooks/usePointerTrack";

function useBrush({
  currentTool,
  secondaryRef,
  lastPointerPositionRef,
  canvasZoom,
  secondaryCtxRef,
  colorData,
  currentToolData,
  primaryCtxRef,
  lastPrimaryStateRef,
  doHistoryAdd,
  doGetCanvasCopy,
  canvasSize,
  primaryRef,
  setColorData,
  setCanvasZoom,
  }) {
  let usedMoveCallback = onPointerMoveCallbackMove;
  let usedDownCallback = onPointerMoveCallbackMove;
  let usedUpCallback = onPointerUpCallbackMove;
  let usedCancelCallback = onCancelCallbackMove;

  if(currentToolData.onPointerMove) {
    usedMoveCallback = (event) => currentToolData.onPointerMove({ event });
  }
  if(currentToolData.onPointerDown) {
    usedDownCallback = (event) => currentToolData.onPointerDown({
      event,
      currentZoom: canvasZoom,
      primaryContext: primaryCtxRef.current,
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

  function onPointerMoveCallbackMove(event) {
    const step = currentTool === 'airbrush' ? 5 : 1;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    let { x: curX, y: curY } = lastPointerPositionRef.current;
    
    const desX = (event.pageX - secondaryRect.x) / canvasZoom;
    const desY = (event.pageY - secondaryRect.y) / canvasZoom;
    lastPointerPositionRef.current = { x: desX, y: desY };

    if(typeof curX === 'undefined') {
      curX = desX;
      curY = desY;
    }

    const diffX = desX - curX;
    const diffY = desY - curY;

    let propX = diffX < 0 ? -1 : 1;
    let propY = diffY < 0 ? -1 : 1;
    
    if(Math.abs(diffX) < Math.abs(diffY)) {
      propX = propX * Math.abs(diffX / diffY);
    } else {
      propY = propY * Math.abs(diffY / diffX);
    }

    secondaryCtxRef.current.fillStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);
    secondaryCtxRef.current.strokeStyle = currentlyPressedRef.current === 0 ? RGBObjectToString(colorData.primary) : RGBObjectToString(colorData.secondary);

    currentToolData.draw({
      primaryContext: primaryCtxRef.current,
      secondaryContext: secondaryCtxRef.current,
      curX: Math.round(curX),
      curY: Math.round(curY),
      desX: Math.round(desX),
      desY: Math.round(desY),
      isRepeated: false,
      currentlyPressed: currentlyPressedRef.current,
      currentlyPressedRef,
      color: { ...colorData }
    });

    while(Math.abs(curX - desX) > step || Math.abs(curY - desY) > step) {
      curX += step * propX;
      curY += step * propY;
      currentToolData.draw({
        primaryContext: primaryCtxRef.current,  
        secondaryContext: secondaryCtxRef.current,
        curX: Math.round(curX),
        curY: Math.round(curY),
        desX: Math.round(desX),
        desY: Math.round(desY),
        isRepeated: true,
        currentlyPressed: currentlyPressedRef.current,
        currentlyPressedRef,
        color: { ...colorData }
      });
    }
  }
  function onPointerUpCallbackMove() {
    lastPointerPositionRef.current = {};

    primaryCtxRef.current.drawImage(secondaryRef.current, 0, 0);
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);

    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef);
    doHistoryAdd({ 
      element: doGetCanvasCopy(primaryRef),
      width: canvasSize.width,
      height: canvasSize.height
    });
  }
  function onCancelCallbackMove() {
    lastPointerPositionRef.current = {};
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
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
    onPointerMoveCallbackMove,
    onPointerUpCallbackMove,
    onCancelCallbackMove,
    onPointerDownBrush: onPointerDown,
  };
}

export default useBrush;

