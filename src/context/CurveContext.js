import React, { useState, createContext, useContext, useRef } from 'react';
import PropTypes from 'prop-types';

const CurveContext = createContext();

function CurveProvider({ children }) {
  const [curvePoints, setCurvePoints] = useState(null);
  const currentCurvePointRef = useRef(0);

  return (
    <CurveContext.Provider
      value={{
        curvePoints, setCurvePoints,
        currentCurvePointRef,
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