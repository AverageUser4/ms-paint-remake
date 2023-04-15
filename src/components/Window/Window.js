import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './Window.module.css';

import WindowPlacementIndicator from '../WindowPlacementIndicator/WindowPlacementIndicator';
import useOutsideClick from '../../hooks/useOutsideClick';
import useResize from '../../hooks/useResize';
import useMove from '../../hooks/useMove';
import useAutoFit from '../../hooks/useAutoFit';
import useAutoShrink from '../../hooks/useAutoShrink';
import { useContainerContext } from '../../context/ContainerContext';
import { useMainWindowContext } from '../../context/MainWindowContext';

function Window({ 
  ID,
  render,
  minimalSize,
  size, setSize,
  position, setPosition,
  isFocused, setIsFocused,
  isResizable,
  isAutoShrink,
  isMainWindow,
  isOpen,
  isIgnorePointerEvents,
  isMaximized,
  isBlockingMainWindow,
}) {
  isResizable = isResizable && !isMaximized;
  const [indicatorData, setIndicatorData] = useState({ strPosition: '', size: { width: 0, height: 0 }, position: { x: 0, y: 0 } });
  const { doMainWindowRestoreSize, mainWindowLatestSize, doMainWindowMaximize, isMainWindowMaximized, mainWindowRef } = useMainWindowContext();
  const { containerRect, isConstrained, isAutoFit, isAllowToLeaveViewport } = useContainerContext();
  const [isActuallyOpen, setIsActuallyOpen] = useState(isOpen);
  const [isAttentionAnimated, setIsAttentionAnimated] = useState(false);
  const windowRef = useRef();
  let zIndex = 'auto';
  zIndex = isMainWindow ? zIndex : '4';
  zIndex = isBlockingMainWindow ? '5' : zIndex;
  
  const { resizeGrabElements } = useResize({ 
    containerRect,
    position, setPosition,
    size, setSize,
    minimalSize,
    isResizable,
    isConstrained,
    isAllowToLeaveViewport,
  });
  const { onPointerDownMove, isMovePressed } = useMove({ 
    containerRect,
    position, setPosition,
    size, setSize,
    onMoveCallback: (event, data) => {
      if(isMainWindow && isMainWindowMaximized) {
        /* handles situation when user tries to move maximized main window */
        const pointerContainerX = event.clientX - containerRect.x;
        const pointerRatioX = pointerContainerX / containerRect.width;
        const widthBeforeCursor = Math.round(mainWindowLatestSize.width * pointerRatioX);
        const adjustedX = pointerContainerX - widthBeforeCursor;
  
        doMainWindowRestoreSize();
        data.setPositionDifference({ x: event.clientX - adjustedX, y: event.clientY });
        setPosition({ x: Math.round(adjustedX), y: 0 })
      }
    },
    onEndCallback: () => {
      if(indicatorData.strPosition) {
        if(indicatorData.strPosition === 'full') {
          doMainWindowMaximize();
        } else {
          setPosition(indicatorData.position);
          setSize(indicatorData.size);
        }
      }
    },
    isMainWindow,
    isConstrained,
  });
  useAutoFit({ 
    containerRect,
    position, setPosition,
    size, setSize,
    isAutoFit 
  });
  useAutoShrink({ 
    containerRect,
    minimalSize,
    position,
    size, setSize,
    isAutoShrink,
    isAutoFit,
    isResizable 
  });

  useOutsideClick({
    containerRef: windowRef,
    callback: () => { 
      if(isMainWindow && isFocused) {
        setIsFocused(false);
      } else if(isBlockingMainWindow && !isMainWindow && !isAttentionAnimated && isOpen && isActuallyOpen) {
        setIsAttentionAnimated(true);
        setTimeout(() => setIsAttentionAnimated(false), 1000);
      }
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

  function onPointerDownFocus() {
    if(isMainWindow && !isFocused)
      setIsFocused(true);
  }
  
  if(!isOpen && !isActuallyOpen) {
    return null;
  }
  
  return (
    <>
      <article
        tabIndex={0}
        data-cy={ID}
        onPointerDown={onPointerDownFocus}
        ref={(element) => {
          if(isMainWindow) {
            mainWindowRef.current = element;
          }
          windowRef.current = element;
        }}
        style={{ 
          top: position.y,
          left: position.x,
          width: size.width,
          height: size.height,
          zIndex,
        }} 
        className={`
          ${css['container']}
          ${isFocused ? css['container--focused'] : ''}
          ${!isMainWindow ? css['container--inner'] : ''}
          ${((isOpen && !isActuallyOpen) || (!isOpen && isActuallyOpen)) ? css['container--hidden'] : ''}
          ${isAttentionAnimated ? css['container--attention'] : ''}
          ${isIgnorePointerEvents ? css['container--locked'] : ''}
          ${!isConstrained ? css['container--fixed'] : ''}
        `}
      >
        {isResizable && resizeGrabElements}
        {render(isAttentionAnimated, onPointerDownMove)}
      </article>

      {
        isMainWindow &&
          <WindowPlacementIndicator
            position={position}
            isConstrained={isConstrained}
            isMaximized={isMainWindowMaximized}
            isBeingMoved={isMovePressed}
            indicatorData={indicatorData}
            setIndicatorData={setIndicatorData}
          />
      }
    </>
  );
}

Window.propTypes = {
  ID: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  minimalSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }).isRequired,
  size: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }).isRequired,
  setSize: PropTypes.func.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  setPosition: PropTypes.func.isRequired,
  isMainWindow: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  setIsFocused: PropTypes.func.isRequired,
  isResizable: PropTypes.bool.isRequired,
  isAutoShrink: PropTypes.bool.isRequired,
  isIgnorePointerEvents: PropTypes.bool.isRequired,
  isMaximized: PropTypes.bool.isRequired,
  isBlockingMainWindow: PropTypes.bool.isRequired,
};

export default Window;
