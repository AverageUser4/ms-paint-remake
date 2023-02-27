import { useEffect, useState, useRef } from 'react';

function usePointerTrack({ 
  onPointerMoveCallback,
  onPointerDownCallback,
  onPointerUpCallback,
  onCancelCallback,
  cancelOnRightMouseDown = false,
  isTrackAlsoRight = false
}) {
  const [isPressed, setIsPressed] = useState(false);
  const currentylPressedRef = useRef(-1);

  useEffect(() => {
    function onPointerUp(event) {
      setIsPressed(false);
      currentylPressedRef.current = -1;
      onPointerUpCallback && onPointerUpCallback(event);
    }

    function onMouseDown(event) {
      if(
          currentylPressedRef.current === 0 && event.button === 2 ||
          currentylPressedRef.current === 2 && event.button === 0 
        ) {
        setIsPressed(false);
        currentylPressedRef.current = -1;
        onCancelCallback && onCancelCallback(event);
      }
    }

    if(isPressed) {
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointermove', onPointerMoveCallback);
      if(cancelOnRightMouseDown) {
        window.addEventListener('mousedown', onMouseDown);
      }
    }

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMoveCallback);
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [isPressed, onPointerMoveCallback, onPointerUpCallback, cancelOnRightMouseDown, onCancelCallback]);
  
  function onPointerDown(event) {
    if(event.button === 0 || (isTrackAlsoRight && event.button === 2)) {
      setIsPressed(true);
      currentylPressedRef.current = event.button;
      onPointerDownCallback && onPointerDownCallback(event);
    }
  }

  function doCancel(isInvokeOnPointerUpCallback = false) {
    setIsPressed(false);
    currentylPressedRef.current = -1;
    isInvokeOnPointerUpCallback && onPointerUpCallback();
    onCancelCallback && onCancelCallback();
  }

  return { onPointerDown, doCancel, isPressed, currentylPressedRef };
}

export default usePointerTrack;