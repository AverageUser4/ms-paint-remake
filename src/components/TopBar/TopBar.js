import React, { useRef, memo } from 'react';
import PropTypes from 'prop-types';
import css from './TopBar.module.css';

import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';

import { useContextMenuContext } from '../../context/ContextMenuContext';
import { useMainWindowContext } from '../../context/MainWindowContext';
import { useCanvasContext } from '../../context/CanvasContext';
import { useActionsContext } from '../../context/ActionsContext';

import logoMini from './assets/logo-mini.png';

const TopBar = memo(function TopBar({ 
  toolbarData,
  setToolbarData,
  ribbonData,
  onPointerDownMoveCallback,
  isMainWindowFocused,
}) {
  const { openContextMenu } = useContextMenuContext();
  const { doMainWindowToggleMaximize } = useMainWindowContext();
  const { doStartNewProject } = useActionsContext();
  const { fileData } = useCanvasContext();
  const containerRef = useRef();
  const textRef = useRef();
  
  function isExpectedTarget(event) {
    return event.target === containerRef.current || event.target === textRef.current;
  }
  
  return (
    <header 
      className={css['container']} 
      onPointerDown={(e) => isExpectedTarget(e) && onPointerDownMoveCallback(e)}
      onContextMenu={(e) => isExpectedTarget(e) && openContextMenu(e, 'window')}
      onDoubleClick={(e) => isExpectedTarget(e) && doMainWindowToggleMaximize(e)}
      ref={containerRef}
      data-cy="TopBar"
    >

      <div className={css['items']}>

        <img draggable="false" src={logoMini} alt=""/>

        {
          !toolbarData.reposition &&
            <QuickAccessToolbar 
              toolbarData={toolbarData}
              setToolbarData={setToolbarData}
              ribbonData={ribbonData}
            />
        }

        <h1 
          className={`text ${!isMainWindowFocused ? 'text--disabled' : ''}`}
          ref={textRef}
        >
          {fileData?.name || 'Untitled'} - Paint
        </h1>
        
      </div>

      <WindowControls 
        closeCallback={() => doStartNewProject()}
      />

    </header>
  );
});

TopBar.propTypes = {
  onPointerDownMoveCallback: PropTypes.func.isRequired,
  isMainWindowFocused: PropTypes.bool.isRequired,
  toolbarData: PropTypes.object.isRequired,
  setToolbarData: PropTypes.func.isRequired,
  ribbonData: PropTypes.object.isRequired,
};

export default TopBar;

