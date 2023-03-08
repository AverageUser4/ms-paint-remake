import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { initialCanvasSize } from './data';

const HistoryContext = createContext();

function HistoryProvider({ children }) {

  const [history, setHistory] = useState({
    dataArray: [{ ...initialCanvasSize, element: document.createElement('canvas') }],
    currentIndex: 0
  });

  function doHistoryAdd(data) {
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

  return (
    <HistoryContext.Provider
      value={{
        history,
        setHistory,
        doHistoryAdd,
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