import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import css from './TopBar.module.css';

import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';
import { useContextMenuContext } from '../../misc/ContextMenuContext';

import logoMini from './assets/logo-mini.png';

function TopBar({ onPointerDownMove, windowHasFocus, toolbarData, setToolbarData, ribbonData }) {
  const containerRef = useRef();
  const textRef = useRef();
  const { openContextMenu } = useContextMenuContext();

  function onContextMenu(event) {
    if(event.button !== 2)
      return;

    if(
      event.target === containerRef.current ||
      event.target === textRef.current
    )
      openContextMenu({ x: event.clientX, y: event.clientY }, <h1>hello, world!</h1>);
  }

  function onPointerDown(event) {
    if(
        event.target === containerRef.current ||
        event.target === textRef.current
      )
      onPointerDownMove(event);
  }
  
  return (
    <header 
      className={css['container']} 
      onPointerDown={onPointerDown}
      onContextMenu={onContextMenu}
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

      <WindowControls windowHasFocus={windowHasFocus}/>

    </header>
  );
}

TopBar.propTypes = {
  onPointerDownMove: PropTypes.func.isRequired,
  windowHasFocus: PropTypes.bool.isRequired,
  toolbarData: PropTypes.object.isRequired,
  setToolbarData: PropTypes.func.isRequired,
  ribbonData: PropTypes.object.isRequired,
};

export default TopBar;

