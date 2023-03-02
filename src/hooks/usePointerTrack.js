import { useEffect, useState, useRef } from 'react';

function usePointerTrack({ 
  onPointerMoveCallback,
  onPointerDownCallback,
  onPointerUpCallback,
  onCancelCallback,
  isCancelOnRightMouseDown = false,
  isTrackAlsoRight = false
}) {
  const [isPressed, setIsPressed] = useState(false);
  const currentlyPressedRef = useRef(-1);

  useEffect(() => {
    function onPointerUp(event) {
      setIsPressed(false);
      currentlyPressedRef.current = -1;
      onPointerUpCallback && onPointerUpCallback(event);
    }

    function onMouseDown(event) {
      if(
          currentlyPressedRef.current === 0 && event.button === 2 ||
          currentlyPressedRef.current === 2 && event.button === 0 
        ) {
        setIsPressed(false);
        currentlyPressedRef.current = -1;
        onCancelCallback && onCancelCallback(event);
      }
    }

    if(isPressed) {
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointermove', onPointerMoveCallback);
      if(isCancelOnRightMouseDown) {
        window.addEventListener('mousedown', onMouseDown);
      }
    }

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMoveCallback);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [isPressed, onPointerMoveCallback, onPointerUpCallback, isCancelOnRightMouseDown, onCancelCallback]);
  
  function onPointerDown(event) {
    if(event.button === 0 || (isTrackAlsoRight && event.button === 2)) {
      setIsPressed(true);
      currentlyPressedRef.current = event.button;
      onPointerDownCallback && onPointerDownCallback(event);
    }
  }

  function doCancel(isInvokeOnPointerUpCallback = false) {
    setIsPressed(false);
    currentlyPressedRef.current = -1;
    isInvokeOnPointerUpCallback && onPointerUpCallback();
    onCancelCallback && onCancelCallback();
  }

  return { onPointerDown, doCancel, isPressed, currentlyPressedRef };
}

export default usePointerTrack;