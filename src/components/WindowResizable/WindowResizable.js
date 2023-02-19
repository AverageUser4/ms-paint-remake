import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import css from './WindowResizable.module.css';

import useResizeCursor from '../../hooks/useResizeCursor';
import usePointerTrack from '../../hooks/usePointerTrack';
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
  const [resizeData, setResizeData] = useState(null);
  useResizeCursor(resizeData);

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

  const { onPointerDown: onPointerDownResize } = 
    usePointerTrack(onPointerMoveResizeCallback, onPointerDownResizeCallback, () => setResizeData(null));

  function onPointerMoveResizeCallback(event) {
    if(!containerRect) {
      return;
    }

    let { clientX, clientY } = event;

    let containerOffsetX = event.clientX - containerRect.x;
    let containerOffsetY = event.clientY - containerRect.y;

    if(!isAllowToLeaveViewport) {
      clientX = Math.max(0, clientX);
      clientY = Math.max(0, clientY);
    }
    
    if(isConstrained) {
      containerOffsetX = Math.max(0, containerOffsetX);
      containerOffsetY = Math.max(0, containerOffsetY);
    }
      
    let diffX = clientX - resizeData.initialX;
    let diffY = clientY - resizeData.initialY;

    let newWidth = size.width;
    let newHeight = size.height;
    let newX = position.x;
    let newY = position.y;

    if(resizeData.type.includes('left')) {
      diffX *= -1;
      newX = isConstrained ? containerOffsetX : clientX;
    }
    if(resizeData.type.includes('top')) {
      diffY *= -1;
      newY = isConstrained ? containerOffsetY : clientY;
    }
    if(resizeData.type.includes('left') || resizeData.type.includes('right')) {
      newWidth = resizeData.initialWidth + diffX;
    }
    if(resizeData.type.includes('top') || resizeData.type.includes('bottom')) {
      newHeight = resizeData.initialHeight + diffY;
    }

    if(newWidth < minimalSize.width) {
      if(resizeData.type.includes('left')) {
        const diffW = minimalSize.width - newWidth;
        newX -= diffW;
      }
      newWidth = minimalSize.width;
    }
    if(newHeight < minimalSize.height) {
      if(resizeData.type.includes('top')) {
        const diffH = minimalSize.height - newHeight;
        newY -= diffH;
      }
      newHeight = minimalSize.height;
    }

    if(isConstrained) {
      if(newX + newWidth > containerRect.width) {
        newWidth = containerRect.width - newX;
      }
      if(newY + newHeight > containerRect.height) {
        newHeight = containerRect.height - newY;
      }
    }

    if(newWidth !== size.width || newHeight !== size.height) {
      setSize({ width: newWidth, height: newHeight });
    }
    if(newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }
  
  function onPointerDownResizeCallback(event) {
    if(isResizable) {
      setResizeData({
        type: event.target.dataset.name,
        initialX: event.clientX,
        initialY: event.clientY,
        initialWidth: size.width,
        initialHeight: size.height
      });
    }
  }

  return (
    <>
      {render(
        isResizable &&
          <>
            <div data-name="top" onPointerDown={onPointerDownResize} className={css['top']}></div>
            <div data-name="bottom" onPointerDown={onPointerDownResize} className={css['bottom']}></div>
            <div data-name="left" onPointerDown={onPointerDownResize} className={css['left']}></div>
            <div data-name="right" onPointerDown={onPointerDownResize} className={css['right']}></div>
            <div data-name="top-left" onPointerDown={onPointerDownResize} className={css['top-left']}></div>
            <div data-name="top-right" onPointerDown={onPointerDownResize} className={css['top-right']}></div>
            <div data-name="bottom-left" onPointerDown={onPointerDownResize} className={css['bottom-left']}></div>
            <div data-name="bottom-right" onPointerDown={onPointerDownResize} className={css['bottom-right']}></div>
          </>
      )}
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