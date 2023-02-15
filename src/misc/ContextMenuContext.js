import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const ContextMenuContext = createContext();

function ContextMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contents, setContents] = useState(null);
  const [position, setPosition] = useState(null);
  
  function openContextMenu(event, contents) {
    if(event.type === 'contextmenu') {
      event.stopPropagation();
      event.preventDefault();
    }
    
    setPosition({ x: event.clientX, y: event.clientY });
    setContents(contents);
    setIsOpen(true);
  }
  
  return (
    <ContextMenuContext.Provider 
      value={{
        isOpen,
        setIsOpen,
        contents,
        position,
        openContextMenu,
      }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
}

ContextMenuProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

function useContextMenuContext() {
  return useContext(ContextMenuContext);
}

export {
  ContextMenuProvider,
  useContextMenuContext
};