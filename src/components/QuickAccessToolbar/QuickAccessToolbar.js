import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from  './QuickAccessToolbar.module.css';

import QuickAccessDropdown from '../QuickAccessDropdown/QuickAccessDropdown';
import Tooltip from '../Tooltip/Tooltip';

import useOutsideClick from '../../hooks/useOutsideClick';
import { useHistoryContext } from '../../context/HistoryContext';

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
  const { doHistoryGoBack, doHistoryGoForward, isHistoryOnFirst, isHistoryOnLast } = useHistoryContext();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => showDropdown && setShowDropdown(false));

  const buttonsData = [
    {
      id: 'email',
      src: email,
      onClick: ()=>0,
      heading: 'Email',
      text: 'Send a copy of the picture in an email message as an attachment.',
    },
    {
      id: 'newFile',
      src: newFile,
      onClick: ()=>0,
      heading: 'New (Ctrl+N)',
      text: 'Create a new picture.',
    },
    {
      id: 'open',
      src: open,
      onClick: ()=>0,
      heading: 'Open (Ctrl+O)',
      text: 'Open an existing picture.',
    },
    {
      id: 'print',
      src: print,
      onClick: ()=>0,
      heading: 'Print (Ctrl+P)',
      text: 'Print the current picture.',
    },
    {
      id: 'printPreview',
      src: printPreview,
      onClick: ()=>0,
      text: 'Print preview.',
    },
    {
      id: 'save',
      src: save,
      onClick: ()=>0,
      heading: 'Save (Ctrl+S)',
      text: 'Save the current picture.',
    },
    {
      id: 'undo',
      src: isHistoryOnFirst ? undoDis : undoEn,
      onClick: () => doHistoryGoBack(),
      heading: 'Undo (Ctrl+Z)',
      text: 'Undo last action.',
    },
    {
      id: 'redo',
      src: isHistoryOnLast ? redoDis : redoEn,
      onClick: () => doHistoryGoForward(),
      heading: 'Redo (Ctrl+Y)',
      text: 'Redo last action.',
    },
  ];

  const buttonElements = toolbarData.buttons.map(item => {
    const data = buttonsData.find(data => data.id === item);
    if(!data)
      throw new Error(`de_Unexpected item in 'toolbarData.buttons' array: '${item}'`);

    return (
      <button 
        key={data.id}
        className="tooltip-container button"
        onClick={data.onClick}
        data-cy={`QuickAccessToolbar-element-${data.id}`}
        aria-describedby={`id-qat-${data.id}`}
      >
        <img draggable="false" src={data.src} alt={data.id}/>
        <Tooltip
          ID={`id-qat-${data.id}`}
          heading={data.heading}
          text={data.text}
        />
      </button>
    );
  });
  
  return (
    <div 
      className={`${css['container']}
      ${toolbarData.reposition ? css['container--repositioned'] : ''}`}
      data-cy="QuickAccessToolbar"
    >

      {buttonElements}

      <div ref={dropdownRef} className={css['dropdown-container']}>
        <button 
          onPointerDown={(e) => e.button === 0 && setShowDropdown(prev => !prev)}
          className="tooltip-container button button--height-20"
          data-cy="QuickAccessToolbar-toggle-QuickAccessDropdown"
          aria-describedby="id-qat-customize"
        >
          <TriangleLine/>
          <Tooltip
            ID="id-qat-customize"
            text="Customize Qucik Access Toolbar"
          />
        </button>

        <QuickAccessDropdown 
          isVisible={showDropdown}
          setIsVisible={setShowDropdown}
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