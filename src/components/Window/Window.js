import React, { useEffect, useState } from 'react';
import css from './Window.module.css';

function Window({ Top, children }) {
  const [position, setPosition] = useState({ x: 200, y: 100 });
  const [positionDifference, setPositionDifference] = useState({});
  
  useEffect(() => {
    function onPointerUp() {
      setPositionDifference({});
    }

    function onPointerMove(event) {
      if(typeof positionDifference.x === 'undefined')
        return;
  
      const x = event.clientX - positionDifference.x;
      const y = event.clientY - positionDifference.y;
      setPosition({ x, y });
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    }

  }, [positionDifference]);
  
  function onPointerDown(event) {
    const x = event.clientX - position.x;
    const y = event.clientY - position.y;
    setPositionDifference({ x, y });
  }
  
  return (
    <article style={{ top: position.y, left: position.x }} className={css['container']}>
      <Top onPointerDown={onPointerDown}/>
      {children}
    </article>
  );
}

export default Window;