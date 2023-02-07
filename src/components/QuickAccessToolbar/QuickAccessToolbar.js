import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from  './QuickAccessToolbar.module.css';

import email from './assets/email.png';
import newFile from './assets/new.png';
import open from './assets/open.png';
import print from './assets/print.png';
import printPreview from './assets/print-preview.png';
import redoDis from './assets/redo-dis.png';
import redoEn from './assets/redo-en.png';
import save from './assets/save.png';
import undoDis from './assets/undo-dis.png';
import undoEn from './assets/undo-en.png';

import { ReactComponent as TriangleLine } from '../../assets/global/triangle-line.svg';

import QuickAccessDropdown from '../QuickAccessDropdown/QuickAccessDropdown';
function QuickAccessToolbar({ repositionToolbar, setRepositionToolbar, availableButtons, setAvailableButtons, hideRibbon, setHideRibbon }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  const buttonsData = [
    {
      id: 'email',
      src: email,
      onClick: ()=>0
    },
    {
      id: 'newFile',
      src: newFile,
      onClick: ()=>0
    },
    {
      id: 'open',
      src: open,
      onClick: ()=>0
    },
    {
      id: 'print',
      src: print,
      onClick: ()=>0
    },
    {
      id: 'printPreview',
      src: printPreview,
      onClick: ()=>0
    },
    {
      id: 'redo',
      src: redoDis,
      onClick: ()=>0
    },
    {
      id: 'save',
      src: save,
      onClick: ()=>0
    },
    {
      id: 'undo',
      src: undoDis,
      onClick: ()=>0
    },
  ];

  const buttonElements = availableButtons.map(item => {
    const data = buttonsData.find(data => data.id === item);
    if(!data)
      throw new Error(`de_Unexpected item in 'availableButtons' array: '${item}'`);

    return (
      <button key={data.id} className="button" onClick={data.onClick}>
        <img draggable="false" src={data.src} alt={data.id}/>
      </button>
    );
  });
  
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
    <div className={`${css['container']} ${repositionToolbar ? css['container--repositioned'] : ''}`}>

      {buttonElements}

      <div ref={dropdownRef} className={css['dropdown-container']}>
        <button onPointerDown={() => setShowDropdown(prev => !prev)} className="button button--height-20">
          <TriangleLine/>
        </button>

        <QuickAccessDropdown 
          isVisible={showDropdown} 
          close={() => setShowDropdown(false)}
          availableButtons={availableButtons}
          setAvailableButtons={setAvailableButtons}
          repositionToolbar={repositionToolbar}
          setRepositionToolbar={setRepositionToolbar}
          hideRibbon={hideRibbon}
          setHideRibbon={setHideRibbon}
        />
      </div>
      
    </div>
  );
}

QuickAccessToolbar.propTypes = {
  repositionToolbar: PropTypes.bool,
  setRepositionToolbar: PropTypes.func,
  availableButtons: PropTypes.array,
  setAvailableButtons: PropTypes.func,
  hideRibbon: PropTypes.bool,
  setHideRibbon: PropTypes.func,
};

export default QuickAccessToolbar;