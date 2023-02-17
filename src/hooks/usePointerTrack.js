import { useEffect, useState } from 'react';

function usePointerTrack(onPointerMoveCallback, onPointerDownCallback) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    function onPointerUp() {
      setIsPressed(false);
    }

    if(isPressed) {
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointermove', onPointerMoveCallback);
    }

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMoveCallback);
    };
  }, [isPressed, onPointerMoveCallback]);
  
  function onPointerDown(event) {
    if(event.button !== 0)
      return;

    setIsPressed(true);
    onPointerDownCallback && onPointerDownCallback(event);
  }

  return onPointerDown;
}

export default usePointerTrack;