import { useEffect } from "react";

function useOutsideClick({
  containerRef,
  callback,
  dataControl = 'veryRandomString',
  isInvokeOnEscapeKey,
}) {
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

    function onKeyDown(event) {
      if(event.key === 'Escape') {
        callback();
      }
    }

    window.addEventListener('click', onClick);
    if(isInvokeOnEscapeKey) {
      window.addEventListener('keydown', onKeyDown);
    }

    return () => {
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [containerRef, callback, dataControl, isInvokeOnEscapeKey]);
}

export default useOutsideClick;