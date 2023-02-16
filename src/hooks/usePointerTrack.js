import { useEffect, useState } from 'react';

function usePointerTrack(onPointerMove) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    function onPointerUp() {
      setIsPressed(false);
    }

    if(isPressed) {
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointermove', onPointerMove);
    }

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isPressed, onPointerMove]);
  
  function onPointerDown(event) {
    if(event.button !== 0)
      return;

    setIsPressed(true);
  }

  return onPointerDown;
}

export default usePointerTrack;