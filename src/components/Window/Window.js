import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './Window.module.css';

import WindowMovable from '../WindowMovable/WindowMovable';
import WindowResizable from '../WindowResizable/WindowResizable';
import useOutsideClick from '../../hooks/useOutsideClick';
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
}) {
  const { containerRect, isConstrained, isAutoFit, isAllowToLeaveViewport } = useContainerContext();
  const [isActuallyOpen, setIsActuallyOpen] = useState(isOpen);
  const [isAttentionAnimated, setIsAttentionAnimated] = useState(false);
  const windowRef = useRef();

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

  function onPointerDownFocus() {
    if(!isInnerWindow && !isFocused)
      setIsFocused(true);
  }
  
  if(!isOpen && !isActuallyOpen)
    return null;
  
  return (
    <WindowMovable
      position={position}
      setPosition={setPosition}
      isAllowToLeaveViewport={isAllowToLeaveViewport}
      isInnerWindow={isInnerWindow}
      isMaximized={isMaximized}
      size={size}
      setSize={setSize}
      isConstrained ={isConstrained}
      isAutoFit={isAutoFit}
      render={(onPointerDownMove) => {
        return (
          <WindowResizable
            position={position} 
            setPosition={setPosition} 
            isAllowToLeaveViewport={isAllowToLeaveViewport} 
            size={size} 
            setSize={setSize}
            isConstrained={isConstrained}
            minimalSize={minimalSize}
            isResizable={isResizable}
            isAutoFit={isAutoFit}
            isAutoShrink={isAutoShrink}
            render={(resizeElements) => {
              return (
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
                  {resizeElements}
                  {render(isAttentionAnimated, onPointerDownMove)}
                </article>
              );
            }}
          />
        );
      }}
    />
  );
}

Window.propTypes = {
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
  isInnerWindow: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  setIsFocused: PropTypes.func.isRequired,
  isResizable: PropTypes.bool.isRequired,
  isAutoShrink: PropTypes.bool.isRequired,
  isIgnorePointerEvents: PropTypes.bool.isRequired,
  isMaximized: PropTypes.bool.isRequired,
};

export default Window;
