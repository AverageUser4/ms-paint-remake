import React from 'react';
import css from './TopBar.module.css';
import logoMini from '../../assets/TopBar/logo-mini.png';
import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import WindowControls from '../WindowControls/WindowControls';

function TopBar() {
  return (
    <header class={css['container']}>

      <div className={css['items']}>

        <img src={logoMini} alt=""/>

        <QuickAccessToolbar/>

        <h1 className="text">Untitled - Paint</h1>
        
      </div>

      <WindowControls/>

    </header>
  );
}

export default TopBar;

