import { useEffect } from "react";

function useOutsideClick(containerRef, callback, dataControl = 'veryRandomString') {
  useEffect(() => {
    function onPointerDown(event) {
      if(
          !containerRef.current ||
          containerRef.current === event.target ||
          containerRef.current.contains(event.target) ||
          event.target.dataset.control === dataControl
        )
        return;

      callback();
    }

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [containerRef, callback, dataControl]);
}

export default useOutsideClick