import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const PaintContext = createContext();

function PaintProvider({ children }) {
  const [canvasData, setCanvasData] = useState({
    mousePosition: null,
    size: { width: 300, height: 200 },
    outlineSize: null,
    zoom: 1,
  });

  return (
    <PaintContext.Provider
      value={{
        canvasData,
        setCanvasData
      }}
    >
      {children}
    </PaintContext.Provider>
  );
}

PaintProvider.propTypes = {
  children: PropTypes.node
};

function usePaintContext() {
  return useContext(PaintContext);
}

export {
  PaintProvider,
  usePaintContext,
};