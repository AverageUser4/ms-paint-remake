import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ContainerContext = createContext();

function ContainerProvider({ children, containerRef, isConstrained, isAutoFit }) {
  /* only dimensions can be read from this state reliably, changes to position only will not cause the state to change */
  const [containerRect, setContainerRect] = useState();

  useEffect(() => {
    if(!containerRect) {
      onResize();
    }

    function onResize() {
      if(isConstrained && containerRef.current) {
        setContainerRect(containerRef.current.getBoundingClientRect());
      } else if(!isConstrained) {
        setContainerRect(document.body.getBoundingClientRect());
      }
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [containerRef, isConstrained, containerRect]);

  return (
    <ContainerContext.Provider
      value={{
        containerRect,
        isConstrained,
        isAutoFit
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}

ContainerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  containerRef: PropTypes.object.isRequired,
  isConstrained: PropTypes.bool,
  isAutoFit: PropTypes.bool
};

function useContainerContext() {
  return useContext(ContainerContext);
}

export {
  ContainerProvider,
  useContainerContext,
};