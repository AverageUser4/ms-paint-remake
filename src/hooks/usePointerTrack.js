import { useEffect, useState } from 'react';

function usePointerTrack({ 
  onPointerMoveCallback,
  onPointerDownCallback,
  onPointerUpCallback,
  onCancelCallback,
  cancelOnRightMouseDown = false
}) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    function onPointerUp(event) {
      setIsPressed(false);
      onPointerUpCallback && onPointerUpCallback(event);
    }

    function onMouseDown(event) {
      if(event.button === 2) {
        setIsPressed(false);
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
    if(event.button !== 0)
      return;

    setIsPressed(true);
    onPointerDownCallback && onPointerDownCallback(event);
  }

  function doCancel(isInvokeOnPointerUpCallback = false) {
    setIsPressed(false);
    isInvokeOnPointerUpCallback && onPointerUpCallback();
  }

  return { onPointerDown, doCancel, isPressed };
}

export default usePointerTrack;