import React from 'react';
import css from  './QuickAccessToolbar.module.css';
import saveFile from './assets/save.png';
import goBack from './assets/undo-dis.png';
import goForward from './assets/redo-dis.png';
import arrowDropdown from '../../assets/global/triangle-down-with-line.png';

function QuickAccessToolbar() {
  return (
    <div className={css['container']}>
      <button className="button">
        <img src={saveFile} alt="Save file."/>
      </button>
      <button className="button">
        <img src={goBack} alt="Undo."/>
      </button>
      <button className="button">
        <img src={goForward} alt="Redo."/>
      </button>
      <button className="button">
        <img src={arrowDropdown} alt="Customize Quick Access Toolbar"/>
      </button>
    </div>
  );
}

export default QuickAccessToolbar;