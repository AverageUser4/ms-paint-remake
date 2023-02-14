import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import css from './Canvas.module.css';

import useResizeCursor from "../../hooks/useResizeCursor";

function Canvas({ canvasData, setCanvasData }) {
  const [resizeData, setResizeData] = useState(null);
  const minWidth = 1;
  const minHeight = 1;
  useResizeCursor(resizeData);

  useEffect(() => {
    function onMouseDown(event) {
      if(resizeData && event.button === 2) {
        setResizeData(null);
        setCanvasData(prev => ({ ...prev, outlineSize: null }));
      }
    }
    
    function onMouseUp() {
      if(resizeData) {
        setCanvasData(prev => ({ ...prev, size: prev.outlineSize, outlineSize: null }));
        setResizeData(null);
      }
    }

    function onMouseMove(event) {
      if(!resizeData)
        return;

      let diffX = event.clientX - resizeData.initialX;
      let diffY = event.clientY - resizeData.initialY;
      let newWidth = canvasData.outlineSize.width;
      let newHeight = canvasData.outlineSize.height;

      if(resizeData.type.includes('right'))
        newWidth = Math.max(resizeData.initialWidth + diffX, minWidth);
      if(resizeData.type.includes('bottom'))
        newHeight = Math.max(resizeData.initialHeight + diffY, minHeight);

      if(newWidth !== canvasData.outlineSize.width || newHeight !== canvasData.outlineSize.height)
        setCanvasData(prev => ({ ...prev, outlineSize: { width: newWidth, height: newHeight } }));
    }

    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
    }
  }, [resizeData, minHeight, minWidth, canvasData, setCanvasData]);

  function onMouseDownResize(event) {
    if(event.button === 0) {
      setResizeData({
        type: event.target.dataset.name,
        initialX: event.clientX,
        initialY: event.clientY,
        initialWidth: canvasData.size.width,
        initialHeight: canvasData.size.height
      });
      setCanvasData(prev => ({ ...prev, outlineSize: prev.size }));
    }
  }

  return (
    <div className={css['container']}>
      <div 
        className={css['canvas']}
        style={{ width: canvasData.size.width, height: canvasData.size.height }}
        onPointerMove={(e) => setCanvasData(prev => ({ ...prev, mousePosition: { x: e.clientX, y: e.clientY } }))}
        onMouseLeave={() => setCanvasData(prev => ({ ...prev, mousePosition: null }))}
      ></div>

      {
        canvasData.outlineSize &&
          <div 
            className={css['outline']}
            style={{ width: canvasData.outlineSize.width, height: canvasData.outlineSize.height }}
          ></div>
      }

      <div onMouseDown={onMouseDownResize} data-name="bottom" className={css["bottom"]}></div>
      <div onMouseDown={onMouseDownResize} data-name="right" className={css["right"]}></div>
      <div onMouseDown={onMouseDownResize} data-name="bottom-right" className={css["bottom-right"]}></div>
    </div>
  );
}

Canvas.propTypes = {
  canvasData: PropTypes.object.isRequired,
  setCanvasData: PropTypes.func.isRequired,
}

export default Canvas;