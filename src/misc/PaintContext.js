import React, { createContext, useContext } from 'react';

const PaintContext = createContext();

function PaintProvider() {
  return (
    <PaintContext.Provider
      value={{

      }}
    >

    </PaintContext.Provider>
  );
}

function usePaintContext() {
  return useContext(PaintContext);
}

export {
  PaintProvider,
  usePaintContext,
};