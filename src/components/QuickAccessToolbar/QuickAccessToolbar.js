import React, { useState } from 'react';
import css from  './QuickAccessToolbar.module.css';

import saveFile from './assets/save.png';
import goBack from './assets/undo-dis.png';
import goForward from './assets/redo-dis.png';
import { ReactComponent as TriangleLine } from '../../assets/global/triangle-line.svg';

import QuickAccessDropdown from '../QuickAccessDropdown/QuickAccessDropdown';
function QuickAccessToolbar() {
  const [showDropdown, setShowDropdown] = useState(true);
  
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

      <div className={css['dropdown-container']}>
        <button onClick={() => setShowDropdown(prev => !prev)} className="button button--height-20">
          <TriangleLine/>
        </button>

        {showDropdown && <QuickAccessDropdown/>}
      </div>
      
    </div>
  );
}

export default QuickAccessToolbar;