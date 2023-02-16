import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ContainerContext = createContext();

function ContainerProvider({ children, containerRef }) {
  const [containerDimensions, setContainerDimensions] = useState();

  useEffect(() => {
    if(!containerRef.current)
      return;

    if(!containerDimensions) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }

    function onResize() {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setContainerDimensions({ width, height });
    }

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [containerDimensions, containerRef]);

  return (
    <ContainerContext.Provider
      value={{
        containerRef,
        containerDimensions,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}

ContainerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  containerRef: PropTypes.object.isRequired,
};

function useContainerContext() {
  return useContext(ContainerContext);
}

export {
  ContainerProvider,
  useContainerContext,
};