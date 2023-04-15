import React, { useContext, createContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';

const MainWindowContext = createContext();

function MainWindowProvider({ children, initialPosition, initialSize, isInitiallyMaximized, minimalSize }) {
  const [mainWindowPosition, setMainWindowPosition] = useState(initialPosition);
  const [mainWindowSize, setMainWindowSize] = useState(initialSize);
  const [mainWindowLatestSize, setMainWindowLatestSize] = useState(initialSize);
  const [mainWindowLatestPosition, setMainWindowLatestPosition] = useState(initialPosition);
  const [isMainWindowFocused, setIsMainWindowFocused] = useState(false);
  const [isMainWindowMaximized, setIsMainWindowMaximized] = useState(isInitiallyMaximized);
  const mainWindowRef = useRef();

  function doMainWindowMinimize() {
    setIsMainWindowMaximized(false);
    setMainWindowSize(mainWindowLatestSize);
    setMainWindowPosition(mainWindowLatestPosition);
  }

  function doMainWindowMaximize() {
    setIsMainWindowMaximized(true);
    setMainWindowLatestSize(mainWindowSize);
    setMainWindowLatestPosition(mainWindowPosition);
  }

  function doMainWindowToggleMaximize() {
    if(isMainWindowMaximized) {
      doMainWindowMinimize();
    }
    else {
      doMainWindowMaximize();
    }
  }
  
  function doMainWindowRestoreSize() {
    setMainWindowSize(mainWindowLatestSize);
    setIsMainWindowMaximized(false);
  }
  
  return (
    <MainWindowContext.Provider
      value={{ 
        mainWindowPosition,
        setMainWindowPosition,
        mainWindowSize,
        setMainWindowSize,
        isMainWindowFocused,
        setIsMainWindowFocused,
        isMainWindowMaximized,
        setIsMainWindowMaximized,
        doMainWindowMinimize,
        doMainWindowMaximize,
        doMainWindowToggleMaximize,
        doMainWindowRestoreSize,
        mainWindowLatestSize,
        mainWindowLatestPosition,
        mainWindowMinimalSize: minimalSize,
        mainWindowRef,
     }}
    >
      {children}
    </MainWindowContext.Provider>
  );
}

MainWindowProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isInitiallyMaximized: PropTypes.bool.isRequired,
  initialPosition: PropTypes.shape({ 
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  initialSize: PropTypes.shape({ 
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  minimalSize: PropTypes.shape({ 
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
};

function useMainWindowContext() {
  return useContext(MainWindowContext);
}

export {
  MainWindowProvider,
  useMainWindowContext,
};