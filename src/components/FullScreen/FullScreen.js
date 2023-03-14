import React, { useRef, useEffect, memo } from 'react';
import css from './FullScreen.module.css';

import { useCanvasContext } from '../../context/CanvasContext';

const FullScreen = memo(function FullScreen() {
  const { isFullScreenView, setIsFullScreenView, primaryRef } = useCanvasContext();
  const showcaseRef = useRef();

  useEffect(() => {
    if(!isFullScreenView) {
      return;
    }

    let { width, height } = primaryRef.current;
    const scale = { x: 1, y: 1 };

    if(width > window.innerWidth) {
      scale.x = window.innerWidth / width;
      width = window.innerWidth;
      scale.y = height * scale.x / height;
      height = height * scale.x;
    }
    if(height > window.innerHeight) {
      scale.y = window.innerHeight / height;
      height = window.innerHeight;
      scale.x = width * scale.y / width;
      width = width * scale.y;
    }
    
    console.log(width, height)
    
    const showcaseContext = showcaseRef.current.getContext('2d');
    showcaseRef.current.width = width;
    showcaseRef.current.height = height;
    showcaseContext.scale(scale.x, scale.y);
    showcaseContext.drawImage(primaryRef.current, 0, 0);
  }, [isFullScreenView, primaryRef]);

  if(!isFullScreenView) {
    return null;
  }
  
  return (
    <div 
      className={css['container']}
      onClick={() => setIsFullScreenView(false)}
    >
      <canvas
        style={{ backgroundColor: 'red' }}
        ref={showcaseRef}
      ></canvas>
    </div>
  );
});

export default FullScreen;