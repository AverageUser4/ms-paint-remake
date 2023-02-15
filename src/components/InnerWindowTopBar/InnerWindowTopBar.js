import React from 'react';
import PropTypes from 'prop-types';
import css from './InnerWindowTopBar.module.css';
import WindowControls from '../WindowControls/WindowControls';

function InnerWindowTopBar({ onPointerDownMove, text, windowHasFocus }) {
  return (
    <header 
      className={css['container']}
      onPointerDown={onPointerDownMove}
    >
      <span className={`text ${!windowHasFocus ? 'text--disabled' : ''}`}>{text}</span>
      <WindowControls isOnlyClose={true} windowHasFocus={windowHasFocus}/>
    </header>
  );
}

InnerWindowTopBar.propTypes = {
  text: PropTypes.string.isRequired,
  onPointerDownMove: PropTypes.func.isRequired,
  windowHasFocus: PropTypes.bool.isRequired
}

export default InnerWindowTopBar;