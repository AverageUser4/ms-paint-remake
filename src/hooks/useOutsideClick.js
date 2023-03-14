import { useEffect } from "react";

function useOutsideClick(containerRef, callback, dataControl = 'veryRandomString') {
  useEffect(() => {
    function onClick(event) {
      if(
          !containerRef.current ||
          containerRef.current === event.target ||
          containerRef.current.contains(event.target) ||
          event.target.dataset.control === dataControl
        )
        return;

      callback();
    }

    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [containerRef, callback, dataControl]);
}

export default useOutsideClick