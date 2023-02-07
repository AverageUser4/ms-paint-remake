import React from 'react';
import PropTypes from 'prop-types';
import css from './TopBar.module.css';

import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';

import logoMini from './assets/logo-mini.png';

function TopBar({ onPointerDown, windowHasFocus, repositionToolbar, setRepositionToolbar, toolbarButtons, setToolbarButtons, hideRibbon, setHideRibbon }) {
  return (
    <header className={css['container']} onPointerDown={onPointerDown}>

      <div className={css['items']}>

        <img draggable="false" src={logoMini} alt=""/>

        {
          !repositionToolbar &&
            <QuickAccessToolbar 
              repositionToolbar={repositionToolbar}
              setRepositionToolbar={setRepositionToolbar}
              availableButtons={toolbarButtons}
              setAvailableButtons={setToolbarButtons}
              hideRibbon={hideRibbon}
              setHideRibbon={setHideRibbon}
            />
        }

        <h1 className={`text ${!windowHasFocus ? 'text--disabled' : ''}`}>Untitled - Paint</h1>
        
      </div>

      <WindowControls windowHasFocus={windowHasFocus}/>

    </header>
  );
}

TopBar.propTypes = {
  onPointerDown: PropTypes.func,
  windowHasFocus: PropTypes.bool,
  repositionToolbar: PropTypes.bool,
  setRepositionToolbar: PropTypes.func,
  toolbarButtons: PropTypes.array,
  setToolbarButtons: PropTypes.func,
  hideRibbon: PropTypes.bool,
  setHideRibbon: PropTypes.func,
};

export default TopBar;

