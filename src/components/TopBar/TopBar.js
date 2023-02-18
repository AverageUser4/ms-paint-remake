import React, { useRef, memo } from 'react';
import PropTypes from 'prop-types';
import css from './TopBar.module.css';

import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';
import { useContextMenuContext } from '../../misc/ContextMenuContext';
import { useMainWindowContext } from '../../misc/MainWindowContext';

import logoMini from './assets/logo-mini.png';

const TopBar = memo(function TopBar({ 
  onPointerDownMove,
  windowHasFocus,
  toolbarData,
  setToolbarData,
  ribbonData,
  setIsPromptWindowOpen,
  doSetWindowToMinimalSize,
}) {
  const containerRef = useRef();
  const textRef = useRef();
  const { openContextMenu } = useContextMenuContext();
  const { mainWindowToggleMaximize } = useMainWindowContext();
  
  function isExpectedTarget(event) {
    return event.target === containerRef.current || event.target === textRef.current;
  }
  
  return (
    <header 
      className={css['container']} 
      onPointerDown={(e) => isExpectedTarget(e) && onPointerDownMove(e)}
      onContextMenu={(e) => isExpectedTarget(e) && openContextMenu(e)}
      onDoubleClick={(e) => isExpectedTarget(e) && mainWindowToggleMaximize(e)}
      ref={containerRef}
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
          className={`text ${!windowHasFocus ? 'text--disabled' : ''}`}
          ref={textRef}
        >Untitled - Paint</h1>
        
      </div>

      <WindowControls 
        close={() => setIsPromptWindowOpen(true)}
        doSetWindowToMinimalSize={doSetWindowToMinimalSize}
      />

    </header>
  );
});

TopBar.propTypes = {
  onPointerDownMove: PropTypes.func.isRequired,
  windowHasFocus: PropTypes.bool.isRequired,
  toolbarData: PropTypes.object.isRequired,
  setToolbarData: PropTypes.func.isRequired,
  ribbonData: PropTypes.object.isRequired,
  setIsPromptWindowOpen: PropTypes.func.isRequired,
  doSetWindowToMinimalSize: PropTypes.func.isRequired,
};

export default TopBar;

