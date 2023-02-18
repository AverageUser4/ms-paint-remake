import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import css from './WindowPlacementIndicator.module.css';

function WindowPlacementIndicator({ 
  isConstrained,
  isMaximized,
  isBeingMoved,
  containerRef,
  indicatorData,
  setIndicatorData 
}) {
  
  useEffect(() => {
    function onPointerMove(event) {
      if(!containerRef.current) {
        return;
      }

      const SPACE = 10;
      const containerRect = containerRef.current.getBoundingClientRect();
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
        setIndicatorData({ strPosition: '', size: { width: 0, height: 0 }, position: { x: 0, y: 0 } });
      }
    }

    if(isBeingMoved) {
      window.addEventListener('pointermove', onPointerMove);
    }

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [isBeingMoved, containerRef, indicatorData, setIndicatorData]);

  if(!isBeingMoved)
    return null;

  return (
    <div 
      className={`
        ${css['container']}
        ${!isConstrained ? css['container--fixed'] : ''}
        ${css[`container--${indicatorData.strPosition}`]}
      `}
    ></div>
  );
}

WindowPlacementIndicator.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  isConstrained: PropTypes.bool.isRequired,
  isMaximized: PropTypes.bool.isRequired,
  isBeingMoved: PropTypes.bool.isRequired,
  containerRef: PropTypes.object.isRequired,
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