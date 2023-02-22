import React, { useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import css from './Canvas.module.css';

import useResize from "../../hooks/useResize";
import usePointerTrack from '../../hooks/usePointerTrack';

function Canvas({ canvasData, setCanvasData }) {
  const tempZoom = 1;
  const canvasStyle = {
    width: canvasData.size.width * tempZoom,
    height: canvasData.size.height * tempZoom,
  };
  
  const primaryRef = useRef();
  const primaryCtxRef = useRef();
  const secondaryRef = useRef();
  const secondaryCtxRef = useRef();
  const lastPointerPositionRef = useRef({});
  const lastPrimaryStateRef = useRef();

  useEffect(() => {
    primaryCtxRef.current = primaryRef.current.getContext('2d');
    secondaryCtxRef.current = secondaryRef.current.getContext('2d');
  }, []);
  
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
    onPointerUpCallback: onPointerUpCallbackResize
  });

  function onPointerUpCallbackResize() {
    setCanvasData(prev => ({ ...prev, outlineSize: null, size: prev.outlineSize }));
  }

  useEffect(() => {
    if(lastPrimaryStateRef.current) {
      primaryCtxRef.current.putImageData(lastPrimaryStateRef.current, 0, 0);
      // so the parts of image that end up outside the viewable are are cut off
      lastPrimaryStateRef.current = primaryCtxRef.current.getImageData(0, 0, canvasData.size.width, canvasData.size.height);
    }
  }, [canvasData.size]);

  const { onPointerDown } = usePointerTrack({ 
    onPointerMoveCallback,
    onPointerDownCallback: onPointerMoveCallback,
    onPointerUpCallback,
    onCancelCallback,
    cancelOnRightMouseDown: true,
  });

  function onPointerMoveCallback(event) {
    const step = 1;
    const secondaryRect = secondaryRef.current.getBoundingClientRect();
    let { x: curX, y: curY } = lastPointerPositionRef.current;

    // curX *= tempZoom;
    // curY *= tempZoom;
    
    const desX = event.pageX - secondaryRect.x;
    const desY = event.pageY - secondaryRect.y;
    lastPointerPositionRef.current = { x: desX, y: desY };
    
    const diffX = desX - curX;
    const diffY = desY - curY;

    let propX = diffX < 0 ? -1 : 1;
    let propY = diffY < 0 ? -1 : 1;
    
    if(Math.abs(diffX) < Math.abs(diffY)) {
      propX = propX * Math.abs(diffX / diffY);
    } else {
      propY = propY * Math.abs(diffY / diffX);
    }

    secondaryCtxRef.current.fillRect(curX, curY, 1, 1);

    while(Math.abs(curX - desX) > step || Math.abs(curY - desY) > step) {
      curX += step * propX;
      curY += step * propY;
      secondaryCtxRef.current.fillRect(Math.round(curX), Math.round(curY), 1, 1);
    }
  }

  function onPointerUpCallback() {
    lastPointerPositionRef.current = {};

    primaryCtxRef.current.drawImage(secondaryRef.current, 0, 0);
    secondaryCtxRef.current.clearRect(0, 0, canvasData.size.width, canvasData.size.height);

    lastPrimaryStateRef.current = primaryCtxRef.current.getImageData(0, 0, canvasData.size.width, canvasData.size.height);
    // const imageData = secondaryCtxRef.current.getImageData(0, 0, canvasData.size.width, canvasData.size.height);
    // primaryCtxRef.current.putImageData(imageData, 0, 0);
    // secondaryCtxRef.current.clearRect(0, 0, canvasData.size.width, canvasData.size.height)
  }

  function onCancelCallback() {
    lastPointerPositionRef.current = {};
    secondaryCtxRef.current.clearRect(0, 0, canvasData.size.width, canvasData.size.height);
  }

  return (
    <div className="point-container">
      <div style={{ width: canvasData.size.width, height: canvasData.size.height }}></div>

      <canvas
        className={`${css['canvas']} ${css['canvas--primary']}`}
        width={canvasData.size.width}
        height={canvasData.size.height}
        onPointerMove={(e) => setCanvasData(prev => ({ ...prev, mousePosition: { x: e.clientX, y: e.clientY } }))}
        onPointerLeave={() => setCanvasData(prev => ({ ...prev, mousePosition: null }))}
        ref={primaryRef}
        style={canvasStyle}
      ></canvas>

      <canvas
        className={css['canvas']}
        width={canvasData.size.width}
        height={canvasData.size.height}
        onPointerMove={(e) => setCanvasData(prev => ({ ...prev, mousePosition: { x: e.clientX, y: e.clientY } }))}
        onPointerLeave={() => setCanvasData(prev => ({ ...prev, mousePosition: null }))}
        onPointerDown={onPointerDown}
        ref={secondaryRef}
        style={canvasStyle}
      ></canvas>

      {resizeElements}
    </div>
  );
}

Canvas.propTypes = {
  canvasData: PropTypes.object.isRequired,
  setCanvasData: PropTypes.func.isRequired,
};

export default Canvas;