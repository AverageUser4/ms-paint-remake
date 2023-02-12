import React from 'react';
import PropTypes from 'prop-types';
import css from './TopBar.module.css';

import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';

import logoMini from './assets/logo-mini.png';

function TopBar({ onPointerDown, windowHasFocus, toolbarData, setToolbarData, ribbonData }) {
  return (
    <header className={css['container']} onPointerDown={onPointerDown}>

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

        <h1 className={`text ${!windowHasFocus ? 'text--disabled' : ''}`}>Untitled - Paint</h1>
        
      </div>

      <WindowControls windowHasFocus={windowHasFocus}/>

    </header>
  );
}

TopBar.propTypes = {
  onPointerDown: PropTypes.func.isRequired,
  windowHasFocus: PropTypes.bool.isRequired,
  toolbarData: PropTypes.object.isRequired,
  setToolbarData: PropTypes.func.isRequired,
  ribbonData: PropTypes.object.isRequired,
};

export default TopBar;

