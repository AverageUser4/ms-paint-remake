import React, { useState } from "react";

import WindowPlacementIndicator from "../components/WindowPlacementIndicator/WindowPlacementIndicator";

import { useMainWindowContext } from '../misc/MainWindowContext';
import { useContainerContext } from '../misc/ContainerContext';
import usePointerTrack from "./usePointerTrack";
import { checkArgs } from "../misc/utils";

export default function useMove({
  position,
  setPosition,
  size,
  setSize,
  isAllowToLeaveViewport,
  isInnerWindow,
  isMaximized,
  isConstrained,
}) {
  checkArgs([
    { name: 'position', value: position, type: 'object' },
    { name: 'setPosition', value: setPosition, type: 'function' },
    { name: 'size', value: size, type: 'object' },
    { name: 'setSize', value: setSize, type: 'function' },
    { name: 'isAllowToLeaveViewport', value: isAllowToLeaveViewport, type: 'boolean' },
    { name: 'isInnerWindow', value: isInnerWindow, type: 'boolean' },
    { name: 'isMaximized', value: isMaximized, type: 'boolean' },
    { name: 'isConstrained', value: isConstrained, type: 'boolean' },
  ]);

  const { containerRect } = useContainerContext();
  const { mainWindowRestoreSize, mainWindowLatestSize, mainWindowMaximize } = useMainWindowContext();
  const [positionDifference, setPositionDifference] = useState(null);
  const [indicatorData, setIndicatorData] = useState({ strPosition: '', size: { width: 0, height: 0 }, position: { x: 0, y: 0 } });
  const { onPointerDown: onPointerDownMove, isPressed: isMovePressed } = 
    usePointerTrack({ 
      onPointerMoveCallback: onPointerMoveMoveCallback,
      onPointerDownCallback: onPointerDownMoveCallback,
      onPointerUpCallback: onPointerUpMoveCallback 
    });

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

  const tempElement = 
    <WindowPlacementIndicator
      position={position}
      isConstrained={isConstrained}
      isMaximized={isMaximized}
      isBeingMoved={isMovePressed}
      indicatorData={indicatorData}
      setIndicatorData={setIndicatorData}
    />;

  return {
    onPointerDownMove,
    tempElement
  };
}