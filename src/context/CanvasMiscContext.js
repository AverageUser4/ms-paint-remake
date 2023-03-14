import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const CanvasMiscContext = createContext();

function CanvasMiscProvider({ children }) {
  const [canvasOutlineSize, setCanvasOutlineSize] = useState(null);
  const [canvasMousePosition, setCanvasMousePosition] = useState(null);

  return (
    <CanvasMiscContext.Provider
      value={{
        canvasMousePosition,
        setCanvasMousePosition,
        canvasOutlineSize, setCanvasOutlineSize,
      }}
    >
      {children}
    </CanvasMiscContext.Provider>
  );
}

CanvasMiscProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useCanvasMiscContext() {
  return useContext(CanvasMiscContext);
}

export {
  CanvasMiscProvider,
  useCanvasMiscContext,
};