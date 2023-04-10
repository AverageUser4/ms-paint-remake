import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { useCanvasContext } from './CanvasContext';
import { initialCanvasSize } from '../misc/data';
import { doGetCanvasCopy } from '../misc/utils';

const MAX_HISTORY_ENTRIES = 50;
const HistoryContext = createContext();

function HistoryProvider({ children }) {
  const { lastPrimaryStateRef } = useCanvasContext();  
  const [history, setHistory] = useState({
    dataArray: [{ ...initialCanvasSize, element: document.createElement('canvas') }],
    currentIndex: 0
  });
  const isHistoryOnFirst = history.currentIndex === 0;
  const isHistoryOnLast = history.currentIndex === history.dataArray.length - 1;

  function doHistoryAdd(data) {
    // data = { element: canvas, width: number, height: number }
    data.element = doGetCanvasCopy(data.element);
    lastPrimaryStateRef.current = doGetCanvasCopy(data.element);
    
    setHistory(prev => {
      let newIndex = prev.currentIndex + 1;
      const newDataArray = prev.dataArray.slice(0, newIndex);
      newDataArray.push(data);

      if(newIndex >= MAX_HISTORY_ENTRIES) {
        newDataArray.shift();
        newIndex--;
      }

      return {
        ...prev,
        dataArray: newDataArray,
        currentIndex: newIndex,
      };
    });
  }

  function doHistoryClear() {
    const data = history.dataArray[history.currentIndex];
    const canvas = document.createElement('canvas');
    canvas.width = data.width;
    canvas.height = data.height;

    setHistory({
      dataArray: [{ ...data, element: canvas }],
      currentIndex: 0
    });
  }

  return (
    <HistoryContext.Provider
      value={{
        history,
        setHistory,
        doHistoryAdd,
        doHistoryClear,
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