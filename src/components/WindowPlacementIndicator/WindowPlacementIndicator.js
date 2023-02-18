import React from "react";
import PropTypes from 'prop-types';
import css from './WindowPlacementIndicator.module.css';

function WindowPlacementIndicator({ position, isConstrained, isMaximized }) {
  return (
    <div 
      className={`
        ${css['container']}
        ${css['container--top-left']}
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
}

export default WindowPlacementIndicator;