import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from  './QuickAccessToolbar.module.css';

import QuickAccessDropdown from '../QuickAccessDropdown/QuickAccessDropdown';
import Tooltip from '../Tooltip/Tooltip';

import useOutsideClick from '../../hooks/useOutsideClick';
import { useHistoryContext } from '../../context/HistoryContext';
import { useActionsContext } from '../../context/ActionsContext';

import email from './assets/email.png';
import newFile from './assets/new.png';
import open from './assets/open.png';
import print from './assets/print.png';
import printPreview from './assets/print-preview.png';
import redo from './assets/redo.png';
import save from './assets/save.png';
import undo from './assets/undo.png';
import { ReactComponent as TriangleLine } from '../../assets/global/triangle-line.svg';

const QuickAccessToolbar = memo(function QuickAccessToolbar({ toolbarData, setToolbarData, ribbonData }) {
  const { isHistoryOnFirst, isHistoryOnLast } = useHistoryContext();
  const { 
    doHistoryGoBack, doHistoryGoForward, doStartNewProject,
    doOpenNewFile, doSaveFile
  } = useActionsContext();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => isDropdownOpen && setIsDropdownOpen(false));

  const buttonsData = [
    {
      id: 'email',
      src: email,
      onClick: ()=>0,
      heading: 'Email',
      text: 'Send a copy of the picture in an email message as an attachment.',
      isDisabled: true,
    },
    {
      id: 'newFile',
      src: newFile,
      onClick: () => doStartNewProject(),
      heading: 'New (Ctrl+N)',
      text: 'Create a new picture.',
    },
    {
      id: 'open',
      src: open,
      onClick: () => doOpenNewFile(),
      heading: 'Open (Ctrl+O)',
      text: 'Open an existing picture.',
    },
    {
      id: 'print',
      src: print,
      onClick: ()=>0,
      heading: 'Print (Ctrl+P)',
      text: 'Print the current picture.',
      isDisabled: true,
    },
    {
      id: 'printPreview',
      src: printPreview,
      onClick: ()=>0,
      text: 'Print preview.',
      isDisabled: true,
    },
    {
      id: 'save',
      src: save,
      onClick: () => doSaveFile(),
      heading: 'Save (Ctrl+S)',
      text: 'Save the current picture.',
    },
    {
      id: 'undo',
      src: undo,
      onClick: () => doHistoryGoBack(),
      heading: 'Undo (Ctrl+Z)',
      text: 'Undo last action.',
      isDisabled: isHistoryOnFirst,
    },
    {
      id: 'redo',
      src: redo,
      onClick: () => doHistoryGoForward(),
      heading: 'Redo (Ctrl+Y)',
      text: 'Redo last action.',
      isDisabled: isHistoryOnLast,
    },
  ];

  const buttonElements = toolbarData.buttons.map(item => {
    const data = buttonsData.find(data => data.id === item);
    if(!data)
      throw new Error(`de_Unexpected item in 'toolbarData.buttons' array: '${item}'`);

    return (
      <button 
        key={data.id}
        className="tooltip-container button button--disabled-grayscale"
        onClick={data.onClick}
        data-cy={`QuickAccessToolbar-element-${data.id}`}
        aria-describedby={`id-qat-${data.id}`}
        disabled={data.isDisabled}
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
          onClick={(e) => e.button === 0 && setIsDropdownOpen(prev => !prev)}
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
          isOpen={isDropdownOpen}
          setIsOpen={setIsDropdownOpen}
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