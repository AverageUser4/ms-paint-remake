import React from 'react';
import css from  './QuickAccessToolbar.module.css';
import saveFile from '../../assets/QuickAccessToolbar/save.png';
import goBack from '../../assets/QuickAccessToolbar/undo-dis.png';
import goForward from '../../assets/QuickAccessToolbar/redo-dis.png';
import arrowDropdown from '../../assets/QuickAccessToolbar/dropdown.png';

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