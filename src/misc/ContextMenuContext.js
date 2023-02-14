import React, { useState, useEffect, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const ContextMenuContext = createContext();

function ContextMenuProvider({ children }) {
  return (
    <ContextMenuContext.Provider value="piesek">
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