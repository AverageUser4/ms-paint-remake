import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ContainerContext = createContext();

function ContainerProvider({ children, containerRef, isConstrained, isAutoFit, isAllowToLeaveViewport }) {
  /* only dimensions can be read from this state reliably, changes to position only will not cause the state to change */
  const [containerRect, setContainerRect] = useState(null);

  useEffect(() => {
    if(!containerRect) {
      onResize();
    }

    function onResize() {
      console.log('onResize')

      if(isConstrained && containerRef.current) {
        console.log('getting container')
        setContainerRect(containerRef.current.getBoundingClientRect());
      } else if(!isConstrained) {
        console.log('getting body')
        setContainerRect(document.body.getBoundingClientRect());
      }
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [containerRef, isConstrained, containerRect]);

  console.log(containerRect)

  return (
    <ContainerContext.Provider
      value={{
        containerRect,
        isConstrained,
        isAutoFit,
        isAllowToLeaveViewport,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}

ContainerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  containerRef: PropTypes.object.isRequired,
  isConstrained: PropTypes.bool.isRequired,
  isAutoFit: PropTypes.bool.isRequired,
  isAllowToLeaveViewport: PropTypes.bool.isRequired,
};

function useContainerContext() {
  return useContext(ContainerContext);
}

export {
  ContainerProvider,
  useContainerContext,
};