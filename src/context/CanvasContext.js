import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useColorContext } from './ColorContext';
import { initialCanvasSize } from '../misc/data';
import { RGBObjectToString, doGetCanvasCopy } from '../misc/utils';

const CanvasContext = createContext();

function CanvasProvider({ children }) {
  const { colorData } = useColorContext();
  const [canvasSize, setCanvasSize] = useState(initialCanvasSize);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [fileData, setFileData] = useState(null);
  const [isFullScreenView, setIsFullScreenView] = useState(false);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);
  const primaryRef = useRef();
  const secondaryRef = useRef();
  const thumbnailPrimaryRef = useRef();
  const thumbnailSecondaryRef = useRef();
  const brushCanvasRef = useRef();
  const lastPrimaryStateRef = useRef();
  const isFirstRenderRef = useRef(true);
  const lastCanvasSizeRef = useRef(canvasSize);
  const lastPointerPositionRef = useRef({});
  const lastCanvasZoomRef = useRef();

  const doCanvasDrawImageToPrimary = useCallback((compatibleElement) => {
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

    function draw(context) {
      context.drawImage(compatibleElement, 0, 0);
    }

    draw(primaryContext);
    thumbnailPrimaryContext && draw(thumbnailPrimaryContext);
  }, []);

  const doCanvasClearPrimary = useCallback(({ x = 0, y = 0, width, height } = {}) => {
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();

    function clear(context) {
      context.fillStyle = RGBObjectToString(colorData.secondary);
      context.fillRect(x, y, width || canvasSize.width, height || canvasSize.height);
    }
    
    clear(primaryContext);
    thumbnailPrimaryContext && clear(thumbnailPrimaryContext);
  }, [canvasSize, colorData.secondary]);

  function doCanvasClearSecondary() {
    const { secondaryContext, thumbnailSecondaryContext } = doGetEveryContext();

    function clear(context) {
      context.clearRect(0, 0, canvasSize.width, canvasSize.height);
    }

    clear(secondaryContext);
    thumbnailSecondaryContext && clear(thumbnailSecondaryContext);
  }

  function doGetEveryContext() {
    return {
      primaryContext: primaryRef.current.getContext('2d'),
      secondaryContext: secondaryRef.current.getContext('2d'),
      thumbnailPrimaryContext: thumbnailPrimaryRef.current?.getContext('2d'),
      thumbnailSecondaryContext: thumbnailSecondaryRef.current?.getContext('2d'),
    };
  }

  useEffect(() => {
    // by default canvas background is transparent,
    // in paint it is supposed to always be in secondary color
    if(!isFirstRenderRef.current) {
      return;
    }
    isFirstRenderRef.current = false;

    doCanvasClearPrimary();
  }, [doCanvasClearPrimary, canvasSize]);

  useEffect(() => {
    // changing width or height attribute (which happens whenever canvasSize changes)
    // of canvas causes it to lose its entire context (both 'settings' like
    // fillStyle and pixels drawn to it), this effect makes sure that after every change
    // to canvas' dimensions, its latest pixels are put back on it
    if(lastCanvasSizeRef.current === canvasSize) {
      return;
    }
    lastCanvasSizeRef.current = canvasSize;
    
    doCanvasClearPrimary();
    
    if(lastPrimaryStateRef.current) {
      doCanvasDrawImageToPrimary(lastPrimaryStateRef.current);
      // so the parts of image that end up outside the viewable are are cut off
      lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
    }
  }, [canvasSize, doCanvasClearPrimary, doCanvasDrawImageToPrimary]);
  
  return (
    <CanvasContext.Provider
      value={{
        canvasSize, setCanvasSize,
        canvasZoom, setCanvasZoom,
        primaryRef,
        secondaryRef,
        brushCanvasRef,
        lastPrimaryStateRef,
        lastPointerPositionRef,
        lastCanvasZoomRef,
        thumbnailPrimaryRef,
        thumbnailSecondaryRef,
        fileData, setFileData,
        doCanvasClearPrimary,
        doCanvasDrawImageToPrimary,
        doCanvasClearSecondary,
        doGetEveryContext,
        isFullScreenView, setIsFullScreenView,
        isBlackAndWhite, setIsBlackAndWhite,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

CanvasProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useCanvasContext() {
  return useContext(CanvasContext);
}

export {
  CanvasProvider,
  useCanvasContext,
};