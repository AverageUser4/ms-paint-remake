import React from 'react';
import PropTypes from 'prop-types';
import css from './InnerWindowTopBar.module.css';
import WindowControls from '../WindowControls/WindowControls';

function InnerWindowTopBar({ onPointerDownMove, text, close, isAttentionAnimated }) {
  return (
    <header 
      className={css['container']}
      onPointerDown={onPointerDownMove}
    >
      <span className={`text ${isAttentionAnimated ? 'text--attention' : ''}`}>{text}</span>
      <WindowControls 
        isOnlyClose={true}
        close={close}
        windowHasFocus={true}
        isAttentionAnimated={isAttentionAnimated}
      />
    </header>
  );
}

InnerWindowTopBar.propTypes = {
  text: PropTypes.string.isRequired,
  onPointerDownMove: PropTypes.func.isRequired,
  isAttentionAnimated: PropTypes.bool,
  close: PropTypes.func.isRequired,
}

export default InnerWindowTopBar;