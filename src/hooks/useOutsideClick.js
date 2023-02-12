import { useEffect } from "react";

function useOutsideClick(containerRef, callback) {
  useEffect(() => {
    function onPointerDown(event) {
      if(
          !containerRef.current ||
          containerRef.current === event.target ||
          containerRef.current.contains(event.target)
        )
        return;

      callback();
    }

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [containerRef, callback]);
}

export default useOutsideClick