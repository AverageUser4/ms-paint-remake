import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import css from './WindowResizable.module.css';

import useResizeCursor from '../../hooks/useResizeCursor';
import usePointerTrack from '../../hooks/usePointerTrack';
import useResize from "../../hooks/useResize";
import { useContainerContext } from '../../misc/ContainerContext';

function WindowResizable({ 
  render, 
  position, 
  setPosition, 
  isAllowToLeaveViewport, 
  size, 
  setSize,
  isConstrained,
  minimalSize,
  isResizable,
  isAutoFit,
  isAutoShrink,
}) {
  const { containerRect } = useContainerContext();
  const { resizeElements } = useResize(position, setPosition, isAllowToLeaveViewport, size, setSize, isConstrained, minimalSize, isResizable);

  useEffect(() => {
    if(!isAutoShrink || !isResizable || !containerRect) {
      return;
    }

    let newWidth = size.width;
    let newHeight = size.height;

    if((position.x === 0 || !isAutoFit) && position.x + size.width > containerRect.width) {
      newWidth = Math.max(containerRect.width - position.x, minimalSize.width);
    }
    if((position.y === 0 || !isAutoFit) && position.y + size.height > containerRect.height) {
      newHeight = Math.max(containerRect.height - position.y, minimalSize.height);
    }

    if(isResizable && (newWidth !== size.width || newHeight !== size.height)) {
      setSize({ width: newWidth, height: newHeight });
    }
  }, [containerRect, size, setSize, position, minimalSize, isAutoShrink, isAutoFit, isResizable]);

  return (
    <>
      {render(resizeElements)}
    </>
  );
}

WindowResizable.propTypes = {
  render: PropTypes.func.isRequired,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  minimalSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  setSize: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  setPosition: PropTypes.func.isRequired,
  isAllowToLeaveViewport: PropTypes.bool.isRequired,
  isConstrained: PropTypes.bool.isRequired,
  isResizable: PropTypes.bool.isRequired,
  isAutoFit: PropTypes.bool.isRequired,
  isAutoShrink: PropTypes.bool.isRequired,
}

export default WindowResizable;