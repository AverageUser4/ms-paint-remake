import React from "react";
import PropTypes from 'prop-types';
import css from './WindowControls.module.css';

import { useMainWindowContext } from "../../context/MainWindowContext";
import { useActionsContext } from "../../context/ActionsContext";

import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Maximize } from './assets/maximize.svg';
import { ReactComponent as Minimize } from './assets/minimize.svg';
import { ReactComponent as RestoreDown } from './assets/restore-down.svg';
import Tooltip from "../Tooltip/Tooltip";

function WindowControls({ isAttentionAnimated, isMainWindow = true, closeCallback }) {
  const { 
    isMainWindowFocused, isMainWindowMaximized, doMainWindowToggleMaximize,
    doMainWindowMinimize
  } = useMainWindowContext();
  const { doStartNewProject } = useActionsContext();
  
  // inner window
  if(!isMainWindow) {
    return (
      <button 
        className={`
          ${css['button']} 
          ${css['button--danger']}
          ${css['button--only']}
          ${isAttentionAnimated ? css['button--attention'] : ''}
        `}
        onClick={(event) => closeCallback(event)}
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
          ${!isMainWindowFocused ? css['button--inactive'] : ''}
        `}
        onClick={(event) => doMainWindowMinimize(event)}
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
          ${!isMainWindowFocused ? css['button--inactive'] : ''}
        `}
        onClick={(event) => doMainWindowToggleMaximize(event)}
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
          ${!isMainWindowFocused ? css['button--inactive'] : ''}
        `}
        onClick={(event) => doStartNewProject(event)}
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
  isMainWindow: PropTypes.bool,
  closeCallback: PropTypes.func,
  isAttentionAnimated: PropTypes.bool,
};

export default WindowControls;