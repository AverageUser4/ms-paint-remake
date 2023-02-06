import React, { useEffect, useRef, useState } from 'react';
import css from  './QuickAccessToolbar.module.css';

import saveFile from './assets/save.png';
import goBack from './assets/undo-dis.png';
import goForward from './assets/redo-dis.png';
import { ReactComponent as TriangleLine } from '../../assets/global/triangle-line.svg';

import QuickAccessDropdown from '../QuickAccessDropdown/QuickAccessDropdown';
function QuickAccessToolbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  
  useEffect(() => {
    function onPointerDown(event) {
      if(!dropdownRef.current || dropdownRef.current === event.target || dropdownRef.current.contains(event.target))
        return;

      if(showDropdown)
        setShowDropdown(false);
    }

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [showDropdown]);
  
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

      <div ref={dropdownRef} className={css['dropdown-container']}>
        <button onPointerDown={() => setShowDropdown(prev => !prev)} className="button button--height-20">
          <TriangleLine/>
        </button>

        <QuickAccessDropdown isVisible={showDropdown} close={() => setShowDropdown(false)}/>
      </div>
      
    </div>
  );
}

export default QuickAccessToolbar;