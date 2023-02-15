import React from 'react';
import PropTypes from 'prop-types';
import css from './InnerWindowTopBar.module.css';

function InnerWindowTopBar({ onPointerDownMove, text }) {
  return (
    <header 
      className={css['container']}
      onPointerDown={onPointerDownMove}
    >
      {text}
      <button>X</button>
    </header>
  );
}

InnerWindowTopBar.propTypes = {
  text: PropTypes.string.isRequired,
  onPointerDownMove: PropTypes.func.isRequired
}

export default InnerWindowTopBar;