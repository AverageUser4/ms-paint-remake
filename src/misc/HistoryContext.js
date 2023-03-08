import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { initialCanvasSize, MAX_CANVAS_SIZE } from './data';
import { doGetCanvasCopy } from './utils';
import { useCanvasContext } from './CanvasContext';

const HistoryContext = createContext();

function HistoryProvider({ children }) {
  const { primaryRef, clearPrimary, lastPrimaryStateRef, setCanvasSize } = useCanvasContext();  
  const [history, setHistory] = useState({
    dataArray: [{ ...initialCanvasSize, element: document.createElement('canvas') }],
    currentIndex: 0
  });
  const isHistoryOnFirst = history.currentIndex === 0;
  const isHistoryOnLast = history.currentIndex === history.dataArray.length - 1;

  function doHistoryAdd(data) {
    console.log('adding to history...')
    // { element: canvas, width: number, height: number }
    setHistory(prev => {
      const newIndex = prev.currentIndex + 1;
      const newDataArray = prev.dataArray.slice(0, newIndex);
      newDataArray.push(data);
      return {
        ...prev,
        dataArray: newDataArray,
        currentIndex: newIndex,
      };
    });
  }

  function doHistorySetToState(index) {
    const data = history.dataArray[index];
    const bufCanvas = document.createElement('canvas');
    bufCanvas.width = MAX_CANVAS_SIZE;
    bufCanvas.height = MAX_CANVAS_SIZE;
    bufCanvas.getContext('2d').drawImage(data.element, 0, 0);
  
    const primaryContext = primaryRef.current.getContext('2d');
    clearPrimary();
    primaryContext.drawImage(bufCanvas, 0, 0);
    lastPrimaryStateRef.current = doGetCanvasCopy(bufCanvas);
  
    setCanvasSize({ width: data.width, height: data.height });
    setHistory(prev => ({ ...prev, currentIndex: index }));
  }
  
  function doHistoryGoBack() {
    if(!isHistoryOnFirst) {
      doHistorySetToState(history.currentIndex - 1);
    }
  }

  function doHistoryGoForward() {
    if(!isHistoryOnLast) {
      doHistorySetToState(history.currentIndex + 1);
    }
  }

  return (
    <HistoryContext.Provider
      value={{
        history,
        setHistory,
        doHistoryAdd,
        doHistoryGoBack,
        doHistoryGoForward,
        isHistoryOnFirst,
        isHistoryOnLast,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

HistoryProvider.propTypes = {
  children: PropTypes.node.isRequired
};

function useHistoryContext() {
  return useContext(HistoryContext);
}

export {
  HistoryProvider,
  useHistoryContext,
};