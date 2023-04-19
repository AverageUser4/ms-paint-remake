import React, { useState, createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

import { useCanvasContext } from './CanvasContext';
import { useHistoryContext } from './HistoryContext';

const CurveContext = createContext();

function CurveProvider({ children }) {
  const { 
    doCanvasDrawImageToPrimary, doCanvasClearSecondary, secondaryRef,
    primaryRef, canvasSize,
  } = useCanvasContext();

  const { doHistoryAdd } = useHistoryContext();
  
  const [curvePoints, setCurvePoints] = useState(null);
  const [curvePointPercents, setCurvePointPercents] = useState(null);
  const currentCurvePointRef = useRef(0);

  function doCurveEnd() {
    setCurvePoints(null);
    setCurvePointPercents(null);
    currentCurvePointRef.current = 0;
  }

  function doCurveDrawToPrimary() {
    if(curvePoints && currentCurvePointRef.current) {
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
    <CurveContext.Provider
      value={{
        curvePoints, setCurvePoints,
        curvePointPercents, setCurvePointPercents,
        currentCurvePointRef,
        doCurveEnd,
        doCurveDrawToPrimary,
      }}
    >
      {children}
    </CurveContext.Provider>
  );
}

CurveProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useCurveContext() {
  return useContext(CurveContext);
}

export {
  CurveProvider,
  useCurveContext,
};