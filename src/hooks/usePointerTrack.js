import { useEffect, useState } from 'react';

function usePointerTrack(onPointerMoveCallback, onPointerDownCallback, onPointerUpCallback) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    function onPointerUp(event) {
      setIsPressed(false);
      onPointerUpCallback && onPointerUpCallback(event);
    }

    if(isPressed) {
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointermove', onPointerMoveCallback);
    }

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMoveCallback);
    };
  }, [isPressed, onPointerMoveCallback, onPointerUpCallback]);
  
  function onPointerDown(event) {
    if(event.button !== 0)
      return;

    setIsPressed(true);
    onPointerDownCallback && onPointerDownCallback(event);
  }

  return onPointerDown;
}

export default usePointerTrack;