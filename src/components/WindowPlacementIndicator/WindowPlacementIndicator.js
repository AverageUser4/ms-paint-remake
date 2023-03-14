import React, { useState, useEffect, memo } from "react";
import PropTypes from 'prop-types';
import css from './WindowPlacementIndicator.module.css';

import { useContainerContext } from "../../context/ContainerContext";

const WindowPlacementIndicator = memo(function WindowPlacementIndicator({ 
  isConstrained,
  isMaximized,
  isBeingMoved,
  indicatorData,
  setIndicatorData 
}) {
  const { containerRect } = useContainerContext();
  
  useEffect(() => {
    function onPointerMove(event) {
      if(isConstrained && !containerRect) {
        return;
      }

      const SPACE = 10;
      let containerOffsetX = event.clientX - containerRect.x;
      let containerOffsetY = event.clientY - containerRect.y;
      let endX = containerRect.width - SPACE;
      let endY = containerRect.height - SPACE;

      const cornerSize = { width: Math.round(containerRect.width / 2), height: Math.round(containerRect.height / 2) };
      const fullSize = { width: containerRect.width, height: containerRect.height };
      const barSize = { width: Math.round(containerRect.width / 2), height: containerRect.height };

      const xRight = containerRect.width / 2;
      const yBottom = containerRect.height / 2;
      
      if(containerOffsetX < SPACE && containerOffsetY < SPACE) {
        indicatorData.strPosition !== 'top-left' && setIndicatorData({ strPosition: 'top-left', size: cornerSize, position: { x: 0, y: 0 } });
      } else if(containerOffsetX > endX && containerOffsetY < SPACE) {
        indicatorData.strPosition !== 'top-right' && setIndicatorData({ strPosition: 'top-right', size: cornerSize, position: { x: xRight, y: 0 } });
      } else if(containerOffsetX > endX && containerOffsetY > endY) {
        indicatorData.strPosition !== 'bottom-right' && setIndicatorData({ strPosition: 'bottom-right', size: cornerSize, position: { x: xRight, y: yBottom } });
      } else if(containerOffsetX < SPACE && containerOffsetY > endY) {
        indicatorData.strPosition !== 'bottom-left' && setIndicatorData({ strPosition: 'bottom-left', size: cornerSize, position: { x: 0, y: yBottom } });
      } else if(containerOffsetX < SPACE) {
        indicatorData.strPosition !== 'left' && setIndicatorData({ strPosition: 'left', size: barSize, position: { x: 0, y: 0 } });
      } else if(containerOffsetY < SPACE) {
        // calls mainWindowMaximize when strPosition === 'full' so size / position data is not used
        indicatorData.strPosition !== 'full' && setIndicatorData({ strPosition: 'full', size: fullSize, position: { x: 0, y: 0 } });
      } else if(containerOffsetX > endX) {
        indicatorData.strPosition !== 'right' && setIndicatorData({ strPosition: 'right', size: barSize, position: { x: xRight, y: 0 } });
      } else if(indicatorData.strPosition) {
        setIndicatorData(prev => ({ ...prev, strPosition: '' }));
      }
    }

    if(isBeingMoved) {
      window.addEventListener('pointermove', onPointerMove);
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isBeingMoved, containerRect, indicatorData, setIndicatorData, isConstrained]);

  if(!isBeingMoved)
    return null;

  return (
    <div 
      className={`
        ${css['container']}
        ${!indicatorData.strPosition ? css['container--hidden'] : ''}
        ${!isConstrained ? css['container--fixed'] : ''}
      `}
      style={{
        width: indicatorData.size.width - 16,
        height: indicatorData.size.height - 16,
        left: indicatorData.position.x + 8,
        top: indicatorData.position.y + 8
      }}
    ></div>
  );
});

WindowPlacementIndicator.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  isConstrained: PropTypes.bool.isRequired,
  isMaximized: PropTypes.bool.isRequired,
  isBeingMoved: PropTypes.bool.isRequired,
  indicatorData: PropTypes.shape({
    strPosition: PropTypes.string.isRequired,
    size: PropTypes.shape({
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    }).isRequired,
    position: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  setIndicatorData: PropTypes.func.isRequired,
}

export default WindowPlacementIndicator;