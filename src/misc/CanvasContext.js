import React, { createContext, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { initialCanvasSize, MAX_CANVAS_SIZE } from './data';
import { useColorContext } from './ColorContext';
import { RGBObjectToString } from './utils';

const zoomData = [
  { multiplier: 0.125, offset: 7 },
  { multiplier: 0.25, offset: 12 },
  { multiplier: 0.50, offset: 23 },
  { multiplier: 1, offset: 45 },
  { multiplier: 2, offset: 51 },
  { multiplier: 3, offset: 57 },
  { multiplier: 4, offset: 63 },
  { multiplier: 5, offset: 68 },
  { multiplier: 6, offset: 73 },
  { multiplier: 7, offset: 78 },
  { multiplier: 8, offset: 83 },
];

const CanvasContext = createContext();

function CanvasProvider({ children }) {
  const { colorData } = useColorContext();
  const [canvasMousePosition, setCanvasMousePosition] = useState(null);
  const [canvasSize, setCanvasSize] = useState(initialCanvasSize);
  const [canvasOutlineSize, setCanvasOutlineSize] = useState(null);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const primaryRef = useRef();
  const secondaryRef = useRef();
  const lastPrimaryStateRef = useRef();

  function clearPrimary(x = 0, y = 0, width = MAX_CANVAS_SIZE, height = MAX_CANVAS_SIZE) {
    const primaryContext = primaryRef.current.getContext('2d');
    primaryContext.fillStyle = RGBObjectToString(colorData.secondary);
    primaryContext.fillRect(x, y, width, height);
  }
  
  return (
    <CanvasContext.Provider
      value={{
        canvasMousePosition,
        setCanvasMousePosition,
        canvasSize,
        setCanvasSize,
        canvasOutlineSize,
        setCanvasOutlineSize,
        canvasZoom, 
        setCanvasZoom,
        primaryRef,
        secondaryRef,
        lastPrimaryStateRef,
        clearPrimary
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

CanvasProvider.propTypes = {
  children: PropTypes.node.isRequired
};

function useCanvasContext() {
  return useContext(CanvasContext);
}

export {
  CanvasProvider,
  useCanvasContext,
  zoomData
};