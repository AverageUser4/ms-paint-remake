import React from "react";
import css from './BottomBar.module.css';

import canvas16 from './assets/canvas-16.ico';
import cursor16 from './assets/cursor-16.ico';
import fileSize16 from './assets/file-size-16.ico';
import selection16 from './assets/selection-16.ico';
import { ReactComponent as Cross } from '../../assets/global/cross.svg';

function BottomBar() {
  return (
    <footer className={css['container']}>
      
      <div className={css['data']}>
        <img draggable="false" src={cursor16} alt="Canvas position."/>
        <span className="text">100, 100px</span>
      </div>
      
      <div className={css['data']}>
        <img draggable="false" src={selection16} alt="Selection size."/>
        <span className="text">100 <Cross/> 100px</span>
      </div>

      <div className={css['data']}>
        <img draggable="false" src={canvas16} alt="Canvas size."/>
        <span className="text">100 <Cross/> 100px</span>
      </div>

      <div className={css['data']}>
        <img draggable="false" src={fileSize16} alt="File size."/>
        <span className="text">Size: 4.8KB</span>
      </div>
      
    </footer>
  );
}

export default BottomBar;