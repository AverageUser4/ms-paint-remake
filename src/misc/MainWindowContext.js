import React, { useContext, createContext, useState } from 'react';
import PropTypes from 'prop-types';

const MainWindowContext = createContext();

function MainWindowProvider({ children, initialPosition, initialSize }) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [latestSize, setLatestSize] = useState(initialSize);
  const [latestPosition, setLatestPosition] = useState(initialPosition);
  const [isFocused, setIsFocused] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  function minimize() {
    setIsMaximized(false);
    setSize(latestSize);
    setPosition(latestPosition);
  }

  function maximize() {
    setIsMaximized(true);
    setLatestSize(size);
    setLatestPosition(position);
  }

  function toggleMaximize() {
    if(isMaximized)
      minimize();
    else
      maximize();
  }
  
  function restoreSize() {
    setSize(latestSize);
    setIsMaximized(false);
  }
  
  return (
    <MainWindowContext.Provider
      value={{ 
        mainWindowPosition: position,
        setMainWindowPosition: setPosition,
        mainWindowSize: size,
        setMainWindowSize: setSize,
        isMainWindowFocused: isFocused,
        setIsMainWindowFocused: setIsFocused,
        isMainWindowMaximized: isMaximized,
        setIsMainWindowMaximized: setIsMaximized,
        mainWindowMinimize: minimize,
        mainWindowMaximize: maximize,
        mainWindowToggleMaximize: toggleMaximize,
        mainWindowRestoreSize: restoreSize,
        mainWindowLatestSize: latestSize,
        mainWindowLatestPosition: latestPosition
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