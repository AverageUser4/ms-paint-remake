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
        <img draggable="false" src={saveFile} alt="Save file."/>
      </button>
      <button className="button">
        <img draggable="false" src={goBack} alt="Undo."/>
      </button>
      <button className="button">
        <img draggable="false" src={goForward} alt="Redo."/>
      </button>
      <button className="button button--height-20">
        <img draggable="false" src={arrowDropdown} alt="Customize Quick Access Toolbar"/>
      </button>
    </div>
  );
}

export default QuickAccessToolbar;