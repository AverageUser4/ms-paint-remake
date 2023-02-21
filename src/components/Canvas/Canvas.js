import React from "react";
import PropTypes from 'prop-types';
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";

function Canvas({ canvasData, setCanvasData }) {
  const { resizeElements } = useResize({ 
    position: { x: 0, y: 0 },
    setPosition: ()=>0,
    isAllowToLeaveViewport: true,
    size: canvasData.outlineSize || canvasData.size,
    setSize: (newSize) => setCanvasData(prev => ({ ...prev, outlineSize: newSize })),
    isConstrained: false,
    minimalSize: { width: 1, height: 1, },
    isResizable: true,
    isPointBased: true,
    isOnlyThreeDirections: true,
    cancelOnRightMouseDown: true,
    onPointerUpCallback: () => setCanvasData(prev => ({ ...prev, outlineSize: null, size: prev.outlineSize }))
  });

  return (
    <div className={css['container']}>
      <div 
        className={css['canvas']}
        style={{ width: canvasData.size.width, height: canvasData.size.height }}
        onPointerMove={(e) => setCanvasData(prev => ({ ...prev, mousePosition: { x: e.clientX, y: e.clientY } }))}
        onPointerLeave={() => setCanvasData(prev => ({ ...prev, mousePosition: null }))}
      ></div>

      {
        canvasData.outlineSize &&
          <div 
            className={css['outline']}
            style={{ width: canvasData.outlineSize.width, height: canvasData.outlineSize.height }}
          ></div>
      }

      {resizeElements}
    </div>
  );
}

Canvas.propTypes = {
  canvasData: PropTypes.object.isRequired,
  setCanvasData: PropTypes.func.isRequired,
}

export default Canvas;