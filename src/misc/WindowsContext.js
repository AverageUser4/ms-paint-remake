import React, { useContext, createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const WindowsContext = createContext();

function WindowsProvider({ children, initialPosition, initialSize, isInitiallyMaximized }) {
  const [mainWindowPosition, setMainWindowPosition] = useState(initialPosition);
  const [mainWindowSize, setMainWindowSize] = useState(initialSize);
  const [mainWindowLatestSize, setMainWindowLatestSize] = useState(initialSize);
  const [mainWindowLatestPosition, setMainWindowLatestPosition] = useState(initialPosition);
  const [isMainWindowFocused, setIsMainWindowFocused] = useState(false);
  const [isMainWindowMaximized, setIsMainWindowMaximized] = useState(isInitiallyMaximized);

  const [isResizeWindowOpen, setIsResizeWindowOpen] = useState(false);
  const [isColorsWindowOpen, setIsColorsWindowOpen] = useState(false);
  const [isPromptWindowOpen, setIsPromptWindowOpen] = useState(false);
  const isAnyInnerWindowOpen = isResizeWindowOpen || isColorsWindowOpen || isPromptWindowOpen;

  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);
  const [isGridLinesVisible, setIsGridLinesVisible] = useState(false);
  const [isRulersVisible, setIsRulersVisible] = useState(true);

  useEffect(() => {
    function closeAll(event) {
      if(event.key === 'Escape') {
        setIsResizeWindowOpen(false);
        setIsColorsWindowOpen(false);
        setIsPromptWindowOpen(false);
      }
    }

    if(isAnyInnerWindowOpen) {
      window.addEventListener('keydown', closeAll);
    }

    return () => {
      window.removeEventListener('keydown', closeAll);
    };
  }, [isAnyInnerWindowOpen]);
  
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
    <WindowsContext.Provider
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
        isResizeWindowOpen, setIsResizeWindowOpen,
        isColorsWindowOpen, setIsColorsWindowOpen,
        isPromptWindowOpen, setIsPromptWindowOpen,
        isAnyInnerWindowOpen,
        isStatusBarVisible,
        setIsStatusBarVisible,
        isGridLinesVisible,
        setIsGridLinesVisible,
        isRulersVisible,
        setIsRulersVisible,
     }}
    >
      {children}
    </WindowsContext.Provider>
  );
}

WindowsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  isInitiallyMaximized: PropTypes.bool.isRequired,
  initialPosition: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  initialSize: PropTypes.shape({ width: PropTypes.number.isRequired, height: PropTypes.number.isRequired }),
};

function useWindowsContext() {
  return useContext(WindowsContext);
}

export {
  WindowsProvider,
  useWindowsContext,
};