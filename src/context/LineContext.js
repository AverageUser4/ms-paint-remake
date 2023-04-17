import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

import { useCanvasContext } from './CanvasContext';
import { useHistoryContext } from './HistoryContext';

const LineContext = createContext();

function LineProvider({ children }) {
  const { 
    doCanvasClearSecondary, doCanvasDrawImageToPrimary, secondaryRef,
    primaryRef, canvasSize
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  
  const [lineData, setLineData] = useState(null);
  const [linePhase, setLinePhase] = useState(0);

  function doLineEnd() {
    setLineData(null);
    setLinePhase(0);
  }

  function doLineDrawToPrimary() {
    if(lineData) {
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
    <LineContext.Provider
      value={{
        lineData, setLineData,
        linePhase, setLinePhase,
        doLineDrawToPrimary,
        doLineEnd,
      }}
    >
      {children}
    </LineContext.Provider>
  );
}

LineProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useLineContext() {
  return useContext(LineContext);
}

export {
  LineProvider,
  useLineContext,
};