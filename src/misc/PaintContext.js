import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const PaintContext = createContext();

const WIDTH = 300;
const HEIGHT = 200;

function PaintProvider({ children }) {
  const [canvasData, setCanvasData] = useState({
    mousePosition: null,
    size: { width: WIDTH, height: HEIGHT },
    outlineSize: null,
    zoom: 1,
  });

  const [history, setHistory] = useState({
    dataArray: [{ element: document.createElement('canvas'), width: WIDTH, height: HEIGHT }],
    currentIndex: 0
  });

  function doHistoryAdd(data) {
    const newDataArray = history.dataArray.slice(0, history.currentIndex + 1);
    newDataArray.push(data);

    setHistory(prev => ({ ...prev, dataArray: newDataArray, currentIndex: prev.currentIndex + 1 }));
  }
  
  return (
    <PaintContext.Provider
      value={{
        canvasData,
        setCanvasData,
        history,
        setHistory,
        doHistoryAdd
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