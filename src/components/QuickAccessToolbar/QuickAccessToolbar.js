import React from 'react';
import saveFile from '../../assets/icons/save-file.png';
import goBack from '../../assets/icons/go-back-disabled.png';
import goForward from '../../assets/icons/go-forward-disabled.png';
import arrowDropdown from '../../assets/icons/arrow-dropdown.png';

function QuickAccessToolbar() {
  return (
    <div className="quick-access-toolbar">
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