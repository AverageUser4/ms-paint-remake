import { useEffect, useState } from 'react';

function usePointerTrack({ 
  onPointerMoveCallback,
  onPointerDownCallback,
  onPointerUpCallback,
  onCancelCallback,
  cancelOnRightMouseDown = false,
  isTrackAlsoRight = false
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [currentlyPressed, setCurrentlyPressed] = useState(-1);

  useEffect(() => {
    function onPointerUp(event) {
      setIsPressed(false);
      setCurrentlyPressed(-1);
      onPointerUpCallback && onPointerUpCallback(event);
    }

    function onMouseDown(event) {
      if(
          currentlyPressed === 0 && event.button === 2 ||
          currentlyPressed === 2 && event.button === 0 
        ) {
        setIsPressed(false);
        setCurrentlyPressed(-1);
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
  }, [isPressed, currentlyPressed, onPointerMoveCallback, onPointerUpCallback, cancelOnRightMouseDown, onCancelCallback]);
  
  function onPointerDown(event) {
    if(event.button === 0 || (isTrackAlsoRight && event.button === 2)) {
      setIsPressed(true);
      setCurrentlyPressed(event.button);
      onPointerDownCallback && onPointerDownCallback(event);
    }
  }

  function doCancel(isInvokeOnPointerUpCallback = false) {
    setIsPressed(false);
    setCurrentlyPressed(-1);
    isInvokeOnPointerUpCallback && onPointerUpCallback();
    onCancelCallback && onCancelCallback();
  }

  return { onPointerDown, doCancel, isPressed, currentlyPressed };
}

export default usePointerTrack;