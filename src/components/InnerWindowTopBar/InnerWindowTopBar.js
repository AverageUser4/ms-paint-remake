import React from 'react';
import PropTypes from 'prop-types';
import css from './InnerWindowTopBar.module.css';
import WindowControls from '../WindowControls/WindowControls';

function InnerWindowTopBar({ onPointerDownMoveCallback, text, closeCallback, isAttentionAnimated }) {
  return (
    <header 
      className={css['container']}
      onPointerDown={onPointerDownMoveCallback}
    >
      <span className={`text ${isAttentionAnimated ? 'text--attention' : ''}`}>{text}</span>
      <WindowControls 
        isInnerWindow={true}
        closeCallback={closeCallback}
        isAttentionAnimated={isAttentionAnimated}
      />
    </header>
  );
}

InnerWindowTopBar.propTypes = {
  text: PropTypes.string.isRequired,
  onPointerDownMoveCallback: PropTypes.func.isRequired,
  closeCallback: PropTypes.func.isRequired,
  isAttentionAnimated: PropTypes.bool,
}

export default InnerWindowTopBar;