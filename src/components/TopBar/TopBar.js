import React, { useRef, memo } from 'react';
import PropTypes from 'prop-types';
import css from './TopBar.module.css';

import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';

import { useContextMenuContext } from '../../misc/ContextMenuContext';
import { useWindowsContext } from '../../misc/WindowsContext';
import { useCanvasContext } from '../../misc/CanvasContext';

import logoMini from './assets/logo-mini.png';

const TopBar = memo(function TopBar({ 
  onPointerDownMove,
  windowHasFocus,
  toolbarData,
  setToolbarData,
  ribbonData,
  doSetWindowToMinimalSize,
}) {
  const { openContextMenu } = useContextMenuContext();
  const { doMainWindowToggleMaximize, setIsPromptWindowOpen } = useWindowsContext();
  const { fileData } = useCanvasContext();
  const containerRef = useRef();
  const textRef = useRef();
  
  function isExpectedTarget(event) {
    return event.target === containerRef.current || event.target === textRef.current;
  }
  
  return (
    <header 
      className={css['container']} 
      onPointerDown={(e) => isExpectedTarget(e) && onPointerDownMove(e)}
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
          className={`text ${!windowHasFocus ? 'text--disabled' : ''}`}
          ref={textRef}
        >
          {fileData?.name || 'Untitled'} - Paint
        </h1>
        
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
  doSetWindowToMinimalSize: PropTypes.func.isRequired,
};

export default TopBar;

