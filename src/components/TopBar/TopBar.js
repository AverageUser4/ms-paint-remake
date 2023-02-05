import React from 'react';
import css from './TopBar.module.css';

import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';

import logoMini from './assets/logo-mini.png';

function TopBar({ onPointerDown }) {
  return (
    <header className={css['container']} onPointerDown={onPointerDown}>

      <div className={css['items']}>

        <img draggable="false" src={logoMini} alt=""/>

        <QuickAccessToolbar/>

        <h1 className="text">Untitled - Paint</h1>
        
      </div>

      <WindowControls/>

    </header>
  );
}

export default TopBar;

