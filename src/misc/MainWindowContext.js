import React, { useContext, createContext, useState } from 'react';
import PropTypes from 'prop-types';

const MainWindowContext = createContext();

function MainWindowProvider({ children, initialPosition, initialSize }) {
  const [mainWindowPosition, setMainWindowPosition] = useState(initialPosition);
  const [mainWindowSize, setMainWindowSize] = useState(initialSize);
  const [mainWindowLatestSize, setMainWindowLatestSize] = useState(initialSize);
  const [mainWindowLatestPosition, setMainWindowLatestPosition] = useState(initialPosition);
  const [isMainWindowFocused, setIsMainWindowFocused] = useState(false);
  const [isMainWindowMaximized, setIsMainWindowMaximized] = useState(false);

  function mainWindowMinimize() {
    setIsMainWindowMaximized(false);
    setMainWindowSize(mainWindowLatestSize);
    setMainWindowPosition(mainWindowLatestPosition);
  }

  function mainWindowMaximize() {
    setIsMainWindowMaximized(true);
    setMainWindowLatestSize(mainWindowSize);
    setMainWindowLatestPosition(mainWindowPosition);
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
        mainWindowMinimize,
        mainWindowMaximize,
     }}
    >
      {children}
    </MainWindowContext.Provider>
  );
}

MainWindowProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialPosition: PropTypes.shape({ x: PropTypes.number.isRequired, y: PropTypes.number.isRequired }),
  initialSize: PropTypes.shape({ width: PropTypes.number.isRequired, height: PropTypes.number.isRequired }),
};

function useMainWindowContext() {
  return useContext(MainWindowContext);
}

export {
  MainWindowProvider,
  useMainWindowContext,
};