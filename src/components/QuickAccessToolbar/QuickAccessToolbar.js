import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from  './QuickAccessToolbar.module.css';

import QuickAccessDropdown from '../QuickAccessDropdown/QuickAccessDropdown';

import useOutsideClick from '../../hooks/useOutsideClick';

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

const QuickAccessToolbar = memo(function QuickAccessToolbar({ toolbarData, setToolbarData, ribbonData }) {
  console.log('QuickAccessToolbar')
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => showDropdown && setShowDropdown(false));

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

  const buttonElements = toolbarData.buttons.map(item => {
    const data = buttonsData.find(data => data.id === item);
    if(!data)
      throw new Error(`de_Unexpected item in 'toolbarData.buttons' array: '${item}'`);

    return (
      <button 
        key={data.id}
        className="button"
        onClick={data.onClick}
        data-cy={`qat-${data.id}`}
      >
        <img draggable="false" src={data.src} alt={data.id}/>
      </button>
    );
  });
  
  return (
    <div className={`${css['container']} ${toolbarData.reposition ? css['container--repositioned'] : ''}`}>

      {buttonElements}

      <div ref={dropdownRef} className={css['dropdown-container']}>
        <button 
          onPointerDown={(e) => e.button === 0 && setShowDropdown(prev => !prev)}
          className="button button--height-20"
          data-cy="qat-open-qad"
        >
          <TriangleLine/>
        </button>

        <QuickAccessDropdown 
          isVisible={showDropdown} 
          close={() => setShowDropdown(false)}
          toolbarData={toolbarData}
          setToolbarData={setToolbarData}
          ribbonData={ribbonData}
        />
      </div>
      
    </div>
  );
});

QuickAccessToolbar.propTypes = {
  ribbonData: PropTypes.object.isRequired,
  toolbarData: PropTypes.object.isRequired,
  setToolbarData: PropTypes.func.isRequired,
};

export default QuickAccessToolbar;