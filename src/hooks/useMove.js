import { useState } from "react";


import usePointerTrack from "./usePointerTrack";
import { checkArgs } from "../misc/utils";

export default function useMove({
  containerRect,
  containerRef,
  position,
  setPosition,
  size,
  setSize,
  canvasZoom = 1,
  onStartCallback,
  onMoveCallback,
  onEndCallback,
  isConstrained,
  isReverseConstrained,
}) {
  checkArgs([
    { position, type: 'object' },
    { setPosition, type: 'function' },
    { size, type: 'object' },
    { setSize, type: 'function' },
    { canvasZoom, type: 'number' },
  ]);

  const [positionDifference, setPositionDifference] = useState(null);
  const { onPointerDown: onPointerDownMove, isPressed: isMovePressed } = usePointerTrack({ 
    onPressedMoveCallback, onPressStartCallback, onPressEndCallback,
  });

  function onPressStartCallback(event) {
    const x = event.clientX - (position.x * canvasZoom);
    const y = event.clientY - (position.y * canvasZoom);
    
    setPositionDifference({ x, y });

    onStartCallback && onStartCallback(event);
  }

  function onPressedMoveCallback(event) {
    if(!containerRect && !containerRef?.current) {
      return;
    }

    if(!containerRect) {
      containerRect = containerRef.current.getBoundingClientRect();
    }

    let x = event.clientX - positionDifference.x;
    let y = event.clientY - positionDifference.y;
    
    if(isConstrained) {
      x = Math.max(Math.min(x, containerRect.width - size.width), 0);
      y = Math.max(Math.min(y, containerRect.height - size.height), 0);
    } else if(isReverseConstrained) {
      x = Math.max(Math.min(x, containerRect.width), -size.width * canvasZoom);
      y = Math.max(Math.min(y, containerRect.height), -size.height * canvasZoom);
    }

    setPosition({ 
      x: Math.round(x / canvasZoom),
      y: Math.round(y / canvasZoom) 
    });

    onMoveCallback && onMoveCallback(event, { setPositionDifference });
  }

  function onPressEndCallback(event) {
    onEndCallback && onEndCallback(event);
    setPositionDifference(null);
  }

  return {
    onPointerDownMove,
    isMovePressed,
  };
}