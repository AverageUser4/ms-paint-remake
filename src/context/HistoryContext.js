import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { useCanvasContext } from './CanvasContext';
import { initialCanvasSize } from '../misc/data';
import { doGetCanvasCopy } from '../misc/utils';

const HistoryContext = createContext();

function HistoryProvider({ children }) {
  const { 
    doCanvasClearPrimary, lastPrimaryStateRef, setCanvasSize, doGetEveryContext,
  } = useCanvasContext();  
  const [history, setHistory] = useState({
    dataArray: [{ ...initialCanvasSize, element: document.createElement('canvas') }],
    currentIndex: 0
  });
  const isHistoryOnFirst = history.currentIndex === 0;
  const isHistoryOnLast = history.currentIndex === history.dataArray.length - 1;

  function doHistoryAdd(data) {
    // { element: canvas, width: number, height: number }
    lastPrimaryStateRef.current = doGetCanvasCopy(data.element);
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
    bufCanvas.width = data.width;
    bufCanvas.height = data.height;
    bufCanvas.getContext('2d').drawImage(data.element, 0, 0);
  
    const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();
    doCanvasClearPrimary({ ...data });
    primaryContext.drawImage(bufCanvas, 0, 0);
    thumbnailPrimaryContext?.drawImage(bufCanvas, 0, 0);
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
        doHistoryGoBack,
        doHistoryGoForward,
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