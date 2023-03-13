import React from "react";
import PropTypes from 'prop-types';
import css from './WindowControls.module.css';

import { useWindowsContext } from "../../misc/WindowsContext";

import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Maximize } from './assets/maximize.svg';
import { ReactComponent as Minimize } from './assets/minimize.svg';
import { ReactComponent as RestoreDown } from './assets/restore-down.svg';
import Tooltip from "../Tooltip/Tooltip";

function WindowControls({ isAttentionAnimated, isInnerWindow = false, close, doSetWindowToMinimalSize }) {
  const { isMainWindowFocused, isMainWindowMaximized, doMainWindowToggleMaximize } = useWindowsContext();
  
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
        data-cy="WindowControls-InnerWindow-close"
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
          tooltip-container
          ${css['button']} 
          ${!isMainWindowFocused ? css['button--disabled'] : ''}
        `}
        onClick={doSetWindowToMinimalSize}
        aria-label="Minimize"
      >
        <Minimize draggable="false"/>
        <Tooltip
          type="generic"
          text="Minimize"
        />
      </button>
      <button 
        className={`
          tooltip-container
          ${css['button']} 
          ${!isMainWindowFocused ? css['button--disabled'] : ''}
        `}
        onClick={doMainWindowToggleMaximize}
        aria-label={isMainWindowMaximized ? 'Restore Down' : 'Maximize'}
      >
        {
          isMainWindowMaximized ?
            <>
              <RestoreDown draggable="false"/>
              <Tooltip
                type="generic"
                text="Restore Down"
              />
            </>
          :
            <>
              <Maximize draggable="false"/>
              <Tooltip
                type="generic"
                text="Maximize"
              />
            </>
        }
      </button>
      <button 
        className={`
          tooltip-container
          ${css['button']} ${css['button--danger']} 
          ${!isMainWindowFocused ? css['button--disabled'] : ''}
        `}
        onClick={close}
        data-cy="WindowControls-close"
        aria-label="Close"
      >
        <Close draggable="false"/>
        <Tooltip
          type="generic"
          text="Close"
        />
      </button>
    </div>  
  );
}

WindowControls.propTypes = {
  isInnerWindow: PropTypes.bool,
  close: PropTypes.func.isRequired,
  doSetWindowToMinimalSize: PropTypes.func,
  isAttentionAnimated: PropTypes.bool,
};

export default WindowControls;