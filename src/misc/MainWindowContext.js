import React, { useContext, createContext, useState } from 'react';
import PropTypes from 'prop-types';

const MainWindowContext = createContext();

function MainWindowProvider({ children, initialPosition, initialSize }) {
  const [mainWindowPosition, setMainWindowPosition] = useState(initialPosition);
  const [mainWindowSize, setMainWindowSize] = useState(initialSize);
  const [isMainWindowFocused, setIsMainWindowFocused] = useState(false);

  return (
    <MainWindowContext.Provider
      value={{ 
        mainWindowPosition,
        setMainWindowPosition,
        mainWindowSize,
        setMainWindowSize,
        isMainWindowFocused,
        setIsMainWindowFocused,
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