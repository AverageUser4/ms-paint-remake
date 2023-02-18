import React from "react";
import PropTypes from 'prop-types';
import css from './WindowControls.module.css';

import { useMainWindowContext } from "../../misc/MainWindowContext";

import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Maximize } from './assets/maximize.svg';
import { ReactComponent as Minimize } from './assets/minimize.svg';
import { ReactComponent as RestoreDown } from './assets/restore-down.svg';

function WindowControls({ isAttentionAnimated, isInnerWindow = false, close }) {
  const { isMainWindowFocused, isMainWindowMaximized, mainWindowToggleMaximize } = useMainWindowContext();
  
  // inner window
  if(isInnerWindow) {
    return (
      <button 
        className={`
          ${css['button']} 
          ${css['button--danger']}
          ${css['button--only']}
          ${isAttentionAnimated ? css['button--attention'] : ''}
        `}
        onClick={close}
      >
        <Close draggable="false"/>
      </button>
    );
  }
  
  // main window
  return (
    <div className={css['container']}>
      <button 
        className={`
          ${css['button']} 
          ${!isMainWindowFocused ? css['button--disabled'] : ''}
        `}
      >
        <Minimize draggable="false"/>
      </button>
      <button 
        className={`
          ${css['button']} 
          ${!isMainWindowFocused ? css['button--disabled'] : ''}
        `}
        onClick={mainWindowToggleMaximize}
      >
        {
          isMainWindowMaximized ?
            <RestoreDown draggable="false"/>
          :
            <Maximize draggable="false"/>
        }
      </button>
      <button 
        className={`
          ${css['button']} ${css['button--danger']} 
          ${!isMainWindowFocused ? css['button--disabled'] : ''}
        `}
        onClick={close}
      >
        <Close draggable="false"/>
      </button>
    </div>  
  );
}

WindowControls.propTypes = {
  isInnerWindow: PropTypes.bool,
  close: PropTypes.func.isRequired,
  isAttentionAnimated: PropTypes.bool,
};

export default WindowControls;