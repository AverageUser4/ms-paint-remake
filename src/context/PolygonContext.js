import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

import { useCanvasContext } from './CanvasContext';
import { useHistoryContext } from './HistoryContext';

const PolygonContext = createContext();

function PolygonProvider({ children }) {
  const { 
    doCanvasDrawImageToPrimary, doCanvasClearSecondary, secondaryRef,
    primaryRef, canvasSize,
  } = useCanvasContext();

  const { doHistoryAdd } = useHistoryContext();
  
  const [polygonPoints, setPolygonPoints] = useState(null);
  const [polygonPointPercents, setPolygonPointPercents] = useState(null);

  function doPolygonEnd() {
    setPolygonPoints(null);
    setPolygonPointPercents(null);
  }

  function doPolygonDrawToPrimary() {
    if(polygonPoints) {
      doCanvasDrawImageToPrimary(secondaryRef.current);
      doCanvasClearSecondary();
  
      doHistoryAdd({
        element: primaryRef.current,
        width: canvasSize.width,
        height: canvasSize.height
      });
    }
  }

  return (
    <PolygonContext.Provider
      value={{
        polygonPoints, setPolygonPoints,
        polygonPointPercents, setPolygonPointPercents,
        doPolygonEnd,
        doPolygonDrawToPrimary,
      }}
    >
      {children}
    </PolygonContext.Provider>
  );
}

PolygonProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function usePolygonContext() {
  return useContext(PolygonContext);
}

export {
  PolygonProvider,
  usePolygonContext,
};