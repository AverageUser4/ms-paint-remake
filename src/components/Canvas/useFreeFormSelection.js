import { useRef } from "react";
import { RGBObjectToString, doGetCanvasCopy, checkArgs } from "../../misc/utils";
import usePointerTrack from "../../hooks/usePointerTrack";

function useFreeFormSelection({
  primaryRef,
  primaryCtxRef,
  secondaryRef,
  secondaryCtxRef,
  lastPointerPositionRef,
  lastPrimaryStateRef,
  currentTool,
  currentToolData,
  canvasZoom,
  canvasSize,
  colorData,
}) {
  checkArgs([
    { name: 'primaryRef', value: primaryRef, type: 'object' },
    { name: 'primaryCtxRef', value: primaryCtxRef, type: 'object' },
    { name: 'currentTool', value: currentTool, type: 'string' },
    { name: 'colorData', value: colorData, type: 'object' },
    { name: 'canvasZoom', value: canvasZoom, type: 'number' },
    { name: 'secondaryRef', value: secondaryRef, type: 'object' },
    { name: 'secondaryCtxRef', value: secondaryCtxRef, type: 'object' },
    { name: 'lastPointerPositionRef', value: lastPointerPositionRef, type: 'object' },
    { name: 'lastPrimaryStateRef', value: lastPrimaryStateRef, type: 'object' },
    { name: 'currentToolData', value: currentToolData, type: 'object' },
    { name: 'canvasSize', value: canvasSize, type: 'object' },
  ]);
  const minPositionRef = useRef();
  const maxPositionRef = useRef();

  function onPointerDownCallback(event) {
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    const offsetX = event.pageX - secondaryRect.x / canvasZoom;
    const offsetY = event.pageY - secondaryRect.y / canvasZoom;
    const position = { x: offsetX, y: offsetY };
    minPositionRef.current = position;
    maxPositionRef.current = position;
  }

  function onPointerMoveCallback(event) {
    const step = currentTool === 'airbrush' ? 5 : 1;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    let { x: curX, y: curY } = lastPointerPositionRef.current;
    
    const desX = Math.max(Math.min((event.pageX - secondaryRect.x) / canvasZoom, secondaryRect.width - 1), 0);
    const desY = Math.max(Math.min((event.pageY - secondaryRect.y) / canvasZoom, secondaryRect.height - 1), 0);
    lastPointerPositionRef.current = { x: desX, y: desY };

    minPositionRef.current = {
      x: Math.min(minPositionRef.current.x, desX),
      y: Math.min(minPositionRef.current.y, desY),
    };
    maxPositionRef.current = {
      x: Math.max(maxPositionRef.current.x, desX),
      y: Math.max(maxPositionRef.current.y, desY),
    };

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
  function onPointerUpCallback() {
    lastPointerPositionRef.current = {};

    primaryCtxRef.current.fillStyle = 'hotpink';
    primaryCtxRef.current.fillRect(
      minPositionRef.current.x,
      minPositionRef.current.y,
      maxPositionRef.current.x - minPositionRef.current.x,
      maxPositionRef.current.y - minPositionRef.current.y,
    );

    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);

    lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
  }
  function onCancelCallback() {
    lastPointerPositionRef.current = {};
    secondaryCtxRef.current.clearRect(0, 0, canvasSize.width, canvasSize.height);
  }

  const { onPointerDown, currentlyPressedRef } = usePointerTrack({ 
    onPointerMoveCallback,
    onPointerDownCallback,
    onPointerUpCallback,
    onCancelCallback,
    isCancelOnRightMouseDown: true,
    isTrackAlsoRight: true
  });

  return { 
    onPointerDownFreeFormSelection: onPointerDown,
  };
}

export default useFreeFormSelection;

