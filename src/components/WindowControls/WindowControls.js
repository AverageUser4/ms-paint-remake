import React from "react";
import css from './WindowControls.module.css';

import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Maximize } from './assets/maximize.svg';
import { ReactComponent as Minimize } from './assets/minimize.svg';

function WindowControls() {
  return (
    <div className={css['container']}>
      <button className={css['button']}>
        <Minimize draggable="false"/>
      </button>
      <button className={css['button']}>
        <Maximize draggable="false"/>
      </button>
      <button className={`${css['button']} ${css['button--danger']}`}>
        <Close draggable="false"/>
      </button>
    </div>  
  );
}

export default WindowControls;
