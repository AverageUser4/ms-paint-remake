import React, { createContext, useContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { useColorContext } from './ColorContext';
import { initialCanvasSize } from '../misc/data';
import { RGBObjectToString } from '../misc/utils';

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
  const [canvasSize, setCanvasSize] = useState(initialCanvasSize);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [isFullScreenView, setIsFullScreenView] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);
  const primaryRef = useRef();
  const secondaryRef = useRef();
  const thumbnailPrimaryRef = useRef();
  const thumbnailSecondaryRef = useRef();
  const lastPrimaryStateRef = useRef();

  function clearPrimary({ x = 0, y = 0, width, height } = {}) {
    const primaryContext = primaryRef.current.getContext('2d');
    const thumbnailPrimaryContext = thumbnailPrimaryRef.current?.getContext('2d');

    function clear(context) {
      context.fillStyle = RGBObjectToString(colorData.secondary);
      context.fillRect(x, y, width || canvasSize.width, height || canvasSize.height);
    }
    
    clear(primaryContext);
    thumbnailPrimaryContext && clear(thumbnailPrimaryContext);
  }

  function changeZoom(decrease) {
    const currentIndex = zoomData.findIndex(data => data.multiplier === canvasZoom); 
    const newIndex = currentIndex + (decrease ? -1 : 1);

    if(newIndex < 0 || newIndex >= zoomData.length) {
      return;
    }

    setCanvasZoom(zoomData[newIndex].multiplier);
  }

  function doCanvasFullReset() {
    clearPrimary();
    setCanvasZoom(1);
    setFileData(null);
    lastPrimaryStateRef.current = null;
  }
  
  return (
    <CanvasContext.Provider
      value={{
        canvasSize, setCanvasSize,
        canvasZoom, setCanvasZoom,
        primaryRef,
        secondaryRef,
        lastPrimaryStateRef,
        thumbnailPrimaryRef,
        thumbnailSecondaryRef,
        clearPrimary,
        changeZoom,
        doCanvasFullReset,
        fileData, setFileData,
        isFullScreenView, setIsFullScreenView,
        isBlackAndWhite, setIsBlackAndWhite,
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