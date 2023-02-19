import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './Window.module.css';

import WindowPlacementIndicator from '../WindowPlacementIndicator/WindowPlacementIndicator';

import useOutsideClick from '../../hooks/useOutsideClick';
import useResizeCursor from '../../hooks/useResizeCursor';
import usePointerTrack from '../../hooks/usePointerTrack';
import { useMainWindowContext } from '../../misc/MainWindowContext';
import { useContainerContext } from '../../misc/ContainerContext';

function Window({ 
  render,
  minimalSize,
  size,
  setSize,
  position,
  setPosition,
  isFocused,
  setIsFocused,
  isResizable,
  isAutoShrink,
  isInnerWindow,
  isOpen,
  isIgnorePointerEvents,
  isMaximized,
  isAllowToLeaveViewport,
}) {
  const { containerRect, isConstrained, isAutoFit } = useContainerContext();
  const { mainWindowRestoreSize, mainWindowLatestSize, mainWindowMaximize } = useMainWindowContext();
  const [isActuallyOpen, setIsActuallyOpen] = useState(isOpen);
  const [positionDifference, setPositionDifference] = useState(null);
  const [resizeData, setResizeData] = useState(null);
  const [isAttentionAnimated, setIsAttentionAnimated] = useState(false);
  const [indicatorData, setIndicatorData] = useState({ strPosition: '', size: { width: 0, height: 0 }, position: { x: 0, y: 0 } });
  const windowRef = useRef();
  useResizeCursor(resizeData);

  isResizable = isResizable && !isMaximized && !isInnerWindow;

  useOutsideClick(windowRef, () => { 
    if(!isInnerWindow && isFocused) {
      setIsFocused(false);
    }
    else if(isInnerWindow && !isAttentionAnimated && isOpen && isActuallyOpen) {
      setIsAttentionAnimated(true);
      setTimeout(() => setIsAttentionAnimated(false), 1000);
    }
  });

  useEffect(() => {
    if(isMaximized && containerRect) {
      setSize({ width: containerRect.width, height: containerRect.height });
      setPosition({ x: 0, y: 0 });
    }
  }, [isMaximized, containerRect, setSize, setPosition, isConstrained]);
  
  useEffect(() => {
    if(isOpen && !isActuallyOpen) {
      setIsActuallyOpen(true);
    }
    if(!isOpen && isActuallyOpen) {
      setTimeout(() => setIsActuallyOpen(false), 150);
    }
  }, [isOpen, isActuallyOpen]);

  const { onPointerDown: onPointerDownMove, isPressed: isMovePressed } = 
    usePointerTrack(onPointerMoveMoveCallback, onPointerDownMoveCallback, onPointerUpMoveCallback);

  function onPointerDownMoveCallback(event) {
    const x = event.clientX - position.x;
    const y = event.clientY - position.y;
    
    setPositionDifference({ x, y });
  }
  
  function onPointerMoveMoveCallback(event) {
    if(!containerRect) {
      return;
    }

    let x = event.clientX - positionDifference.x;
    let y = event.clientY - positionDifference.y;
    
    if(!isAllowToLeaveViewport) {
      x = Math.max(Math.min(x, containerRect.width - size.width), 0);
      y = Math.max(Math.min(y, containerRect.height - size.height), 0);
    }

    if(!isInnerWindow && isMaximized) {
      const pointerContainerX = event.clientX - containerRect.x;
      const pointerRatioX = pointerContainerX / containerRect.width;

      const widthBeforeCursor = Math.round(mainWindowLatestSize.width * pointerRatioX);

      const adjustedX = pointerContainerX - widthBeforeCursor;

      mainWindowRestoreSize();
      setPositionDifference({ x: event.clientX - adjustedX, y: event.clientY });
      setPosition({ x: adjustedX, y: 0 })
    } else {
      setPosition({ x, y });
    }
  }

  function onPointerUpMoveCallback() {
    if(indicatorData.strPosition) {
      if(indicatorData.strPosition === 'full') {
        mainWindowMaximize();
      } else {
        setPosition(indicatorData.position);
        setSize(indicatorData.size);
      }
    }
    setPositionDifference(null);
  }

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

  useEffect(() => {
    if(!isAutoFit || !containerRect) {
      return;
    }

    let newX = position.x;
    let newY = position.y;

    if(position.x + size.width > containerRect.width) {
      newX = Math.max(containerRect.width - size.width, 0);
    }
    if(position.y + size.height > containerRect.height) {
      newY = Math.max(containerRect.height - size.height, 0);
    }

    if(newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }, [containerRect, size, position, isAutoFit, setPosition]);

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

  function onPointerDownFocus() {
    if(!isInnerWindow && !isFocused)
      setIsFocused(true);
  }
  
  if(!isOpen && !isActuallyOpen)
    return null;
  
  return (
    <>
      <article
        onPointerDown={onPointerDownFocus}
        ref={windowRef}
        style={{ 
          top: position.y,
          left: position.x,
          width: size.width,
          height: size.height,
          zIndex: isInnerWindow ? '4' : 'auto',
        }} 
        className={`
          ${css['container']}
          ${isFocused ? css['container--focused'] : ''}
          ${isInnerWindow ? css['container--inner'] : ''}
          ${((isOpen && !isActuallyOpen) || (!isOpen && isActuallyOpen)) ? css['container--hidden'] : ''}
          ${isAttentionAnimated ? css['container--attention'] : ''}
          ${isIgnorePointerEvents ? css['container--locked'] : ''}
          ${!isConstrained ? css['container--fixed'] : ''}
        `}
      >
        {
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
        }
        {render(isAttentionAnimated, onPointerDownMove)}
      </article>

      {
        !isInnerWindow &&
          <WindowPlacementIndicator
            position={position}
            isConstrained={isConstrained}
            isMaximized={isMaximized}
            isBeingMoved={isMovePressed}
            indicatorData={indicatorData}
            setIndicatorData={setIndicatorData}
          />
      }
    </>
  );
}

Window.propTypes = {
  render: PropTypes.func.isRequired,
  minimalSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  setSize: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  isFocused: PropTypes.bool,
  setIsFocused: PropTypes.func,
  setPosition: PropTypes.func.isRequired,
  isResizable: PropTypes.bool,
  isAutoShrink: PropTypes.bool,
  isInnerWindow: PropTypes.bool,
  isOpen: PropTypes.bool,
  isIgnorePointerEvents: PropTypes.bool,
  isMaximized: PropTypes.bool,
  isAllowToLeaveViewport: PropTypes.bool,
};

export default Window;
