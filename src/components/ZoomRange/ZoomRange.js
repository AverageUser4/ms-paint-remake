import React, { useEffect, useRef, useState } from 'react';
import css from './ZoomRange.module.css';

const zoomData = [
  { percent: 12.5, offset: 7 },
  { percent: 25, offset: 12 },
  { percent: 50, offset: 23 },
  { percent: 100, offset: 45 },
  { percent: 200, offset: 51 },
  { percent: 300, offset: 57 },
  { percent: 400, offset: 63 },
  { percent: 500, offset: 68 },
  { percent: 600, offset: 73 },
  { percent: 700, offset: 78 },
  { percent: 800, offset: 83 },
];

function getOffsetForPercent(percent) {
  return zoomData.find(data => data.percent === percent).offset;
}

function findClosestPercent(offset) {
  let closest = { percent: zoomData[0].percent, difference: Math.abs(offset - zoomData[0].offset )};

  for(let i = 1; i < zoomData.length; i++) {
    const difference = Math.abs(offset - zoomData[i].offset);
    if(difference < closest.difference)
      closest = { percent: zoomData[i].percent, difference };
  }

  return closest.percent;
}

function ZoomRange() {
  const [zoomPercent, setZoomPercent] = useState(100);
  const [isControlFocused, setIsControlFocused] = useState(false);
  const rangeRef = useRef();
  
  useEffect(() => {
    function onPointerUp() {
      if(isControlFocused)
        setIsControlFocused(false);
    }

    function onPointerMove(event) {
      if(!isControlFocused)
        return;

      const difference = event.clientX - rangeRef.current.getBoundingClientRect().x;
      const percent = findClosestPercent(difference);

      if(zoomPercent !== percent)
        setZoomPercent(percent);
    }

    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    return () => {
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isControlFocused, zoomPercent]);
  
  function changeZoom(decrease) {
    const currentIndex = zoomData.findIndex(data => data.percent === zoomPercent); 
    const newIndex = currentIndex + (decrease ? -1 : 1);

    if(newIndex < 0 || newIndex >= zoomData.length)
      return;

    setZoomPercent(zoomData[newIndex].percent);
  }

  return (
    <>
      <span style={{ width: 35 }} className="text">{zoomPercent}%</span>

      <button className={css['minus']} onClick={() => changeZoom(true)}></button>

      <div 
        tabIndex="0" 
        className={css['range']}
        ref={rangeRef}
      >
        <div 
          style={{ left: getOffsetForPercent(zoomPercent) }} 
          className={css['range-control']}
          onPointerDown={(e) => e.button === 0 && setIsControlFocused(true)}
        ></div>
      </div>

      <button className={css['plus']} onClick={() => changeZoom(false)}></button>
    </>
  );
}

export default ZoomRange;