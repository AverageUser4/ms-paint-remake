import React, { useState, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const ContextMenuContext = createContext();

function ContextMenuProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentType, setContentType] = useState(null);
  const [position, setPosition] = useState(null);
  const [data, setData] = useState();
  
  function openContextMenu(event, contentType, data) {
    if(event.type !== 'contextmenu') {
      console.error(`This function should be triggered only by "contextmenu" event, passed event contentType: "${event.type}".`);
    }

    event.stopPropagation();
    event.preventDefault();
    
    setPosition({ x: event.clientX, y: event.clientY });
    setContentType(contentType);
    setData(data);
    setIsOpen(true);
  }
  
  return (
    <ContextMenuContext.Provider 
      value={{
        isOpen,
        setIsOpen,
        contentType,
        position,
        openContextMenu,
        data,
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