import React, { useContext, createContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const WindowsContext = createContext();

function WindowsProvider({ children }) {
  const [isResizeWindowOpen, setIsResizeWindowOpen] = useState(false);
  const [isColorsWindowOpen, setIsColorsWindowOpen] = useState(false);
  const [isPromptWindowOpen, setIsPromptWindowOpen] = useState(false);
  const [isAboutWindowOpen, setIsAboutWindowOpen] = useState(true);
  const isAnyInnerWindowOpen = 
    isResizeWindowOpen || isColorsWindowOpen || isPromptWindowOpen || isAboutWindowOpen;
  const promptWindowCallbackRef = useRef(()=>0);

  const [isStatusBarVisible, setIsStatusBarVisible] = useState(true);
  const [isGridLinesVisible, setIsGridLinesVisible] = useState(false);
  const [isRulersVisible, setIsRulersVisible] = useState(false);

  function doRequirePromptWindow(callback = ()=>0) {
    setIsPromptWindowOpen(true);
    promptWindowCallbackRef.current = callback;
  }
  
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
  
  return (
    <WindowsContext.Provider
      value={{ 
        isResizeWindowOpen, setIsResizeWindowOpen,
        isColorsWindowOpen, setIsColorsWindowOpen,
        isPromptWindowOpen, setIsPromptWindowOpen,
        isAboutWindowOpen, setIsAboutWindowOpen,
        isAnyInnerWindowOpen,
        isStatusBarVisible,
        setIsStatusBarVisible,
        isGridLinesVisible,
        setIsGridLinesVisible,
        isRulersVisible,
        setIsRulersVisible,
        promptWindowCallbackRef,
        doRequirePromptWindow,
     }}
    >
      {children}
    </WindowsContext.Provider>
  );
}

WindowsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

function useWindowsContext() {
  return useContext(WindowsContext);
}

export {
  WindowsProvider,
  useWindowsContext,
};