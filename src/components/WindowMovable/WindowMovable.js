import React, { useState } from "react";
import PropTypes from 'prop-types';
import css from './WindowMovable.module.css';

import WindowPlacementIndicator from '../WindowPlacementIndicator/WindowPlacementIndicator';

import { useMainWindowContext } from '../../misc/MainWindowContext';
import { useContainerContext } from '../../misc/ContainerContext';
import usePointerTrack from "../../hooks/usePointerTrack";

function WindowMovable({ children, position, setPosition, isAllowToLeaveViewport, isInnerWindow, isMaximized, size, setSize, isConstrained }) {
  const { containerRect } = useContainerContext();
  const { mainWindowRestoreSize, mainWindowLatestSize, mainWindowMaximize } = useMainWindowContext();
  const [positionDifference, setPositionDifference] = useState(null);
  const [indicatorData, setIndicatorData] = useState({ strPosition: '', size: { width: 0, height: 0 }, position: { x: 0, y: 0 } });
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

  return (
    <>
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

WindowMovable.propTypes = {
  children: PropTypes.node.isRequired,
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
  isInnerWindow: PropTypes.bool,
  isMaximized: PropTypes.bool,
  isAllowToLeaveViewport: PropTypes.bool,
  isConstrained: PropTypes.bool,
}

export default WindowMovable;