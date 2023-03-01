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
    const newDataArray = history.dataArray.slice(0, history.currentIndex + 1);
    newDataArray.push(data);

    setHistory(prev => ({ ...prev, dataArray: newDataArray, currentIndex: prev.currentIndex + 1 }));
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