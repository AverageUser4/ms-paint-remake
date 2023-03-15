import React, { useContext, createContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const WindowsContext = createContext();

function WindowsProvider({ children }) {
  const [isResizeWindowOpen, setIsResizeWindowOpen] = useState(false);
  const [isColorsWindowOpen, setIsColorsWindowOpen] = useState(false);
  const [isPromptWindowOpen, setIsPromptWindowOpen] = useState(false);
  const [isAboutWindowOpen, setIsAboutWindowOpen] = useState(false);
  const [isPropertiesWindowOpen, setIsPropertiesWindowOpen] = useState(false);
  const [isThumbnailWindowOpen, setIsThumbnailWindowOpen] = useState(true);
  const promptWindowCallbackRef = useRef(()=>0);
  const isAnyBlockingWindowOpen = 
    isResizeWindowOpen || isColorsWindowOpen || isPromptWindowOpen ||
    isAboutWindowOpen || isPropertiesWindowOpen;
  const isAnyInnerWindowOpen = isAnyBlockingWindowOpen || isThumbnailWindowOpen;

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
        setIsAboutWindowOpen(false);
        setIsPropertiesWindowOpen(false);
        setIsThumbnailWindowOpen(false);
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
        isPropertiesWindowOpen, setIsPropertiesWindowOpen,
        isThumbnailWindowOpen, setIsThumbnailWindowOpen,
        isAnyBlockingWindowOpen,
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