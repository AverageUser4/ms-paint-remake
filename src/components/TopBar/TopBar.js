import React from 'react';
import logoMini from '../../assets/icons/logo-mini.png';
import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';

function TopBar() {
  return (
    <header class="top-bar">

      <div className="tob-bar__items">
        <img src={logoMini} alt=""/>

        <QuickAccessToolbar/>

        <h1>Untitled - Paint</h1>
      </div>

      <div className="top-bar__controls">
        <button>-</button>
        <button>O</button>
        <button>X</button>
      </div>

    </header>
  );
}

export default TopBar;

