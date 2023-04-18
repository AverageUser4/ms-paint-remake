import { useEffect, useState, useRef } from 'react';

function usePointerTrack({ 
  onPressedMoveCallback,
  onPressStartCallback,
  onPressEndCallback,
  onCancelCallback,
  onEveryMoveCallback,
  isCancelOnRightMouseDown = false,
  isTrackAlsoRight = false,
  isWitholdCancel = false,
}) {
  const [isPressed, setIsPressed] = useState(false);
  const currentlyPressedRef = useRef(-1);

  useEffect(() => {
    function onPointerUp(event) {
      setIsPressed(false);
      currentlyPressedRef.current = -1;
      onPressEndCallback && onPressEndCallback(event);
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
      window.addEventListener('pointermove', onPressedMoveCallback);
      if(isCancelOnRightMouseDown && !isWitholdCancel) {
        window.addEventListener('mousedown', onMouseDown);
      }
    }

    if(onEveryMoveCallback) {
      window.addEventListener('pointermove', onEveryMoveCallback);
    }

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPressedMoveCallback);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('pointermove', onEveryMoveCallback);
    };
  }, [isPressed, onPressedMoveCallback, onPressEndCallback, isCancelOnRightMouseDown, onCancelCallback, onEveryMoveCallback, isWitholdCancel]);
  
  function onPointerDown(event) {
    if(event.button === 0 || (isTrackAlsoRight && event.button === 2)) {
      setIsPressed(true);
      currentlyPressedRef.current = event.button;
      onPressStartCallback && onPressStartCallback(event);
    }
  }

  function doCancel(isInvokeOnPressEndCallback = false) {
    setIsPressed(false);
    currentlyPressedRef.current = -1;
    isInvokeOnPressEndCallback && onPressEndCallback();
    onCancelCallback && onCancelCallback();
  }

  return { onPointerDown, doCancel, isPressed, currentlyPressedRef };
}

export default usePointerTrack;