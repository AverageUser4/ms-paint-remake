import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import css from './QuickAccessDropdown.module.css';

import Dropdown from '../Dropdown/Dropdown';

function QuickAccessDropdown({ isVisible, close, toolbarData, setToolbarData, ribbonData }) {
  const dropdownContainerRef = useRef();
  
  function onChange(event) {
    const { name } = event.target;
    
    setToolbarData(prev => {
      const prevButtons = prev.buttons;
      let newButtons;

      if(prevButtons.includes(name))
        newButtons = prevButtons.filter(item => item !== name);
      else
        newButtons = [...prevButtons, name];
    
      return { ...prev, buttons: newButtons };
    });
  }
  
  return (
    <Dropdown 
      isVisible={isVisible} 
      classes={css['container']}
      dropdownContainerRef={dropdownContainerRef}
      ref={dropdownContainerRef}
    >
      <div 
        data-cy="QuickAccessDropdown"
      >
        
        <div className={css['top']}>
          <h3 className="head head--dark">Customize Quick Access Toolbar</h3>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className={css['form']} onClick={close}>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-newFile"
              className={css['checkbox']}
              type="checkbox"
              name="newFile"
              checked={toolbarData.buttons.includes('newFile')}
              onChange={onChange}
            />
            <span className="text text--1">New</span>
          </label>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-open"
              className={css['checkbox']}
              type="checkbox"
              name="open"
              checked={toolbarData.buttons.includes('open')}
              onChange={onChange}
            />
            <span className="text text--1">Open</span>
          </label>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-save"
              className={css['checkbox']}
              type="checkbox"
              name="save"
              checked={toolbarData.buttons.includes('save')}
              onChange={onChange}
            />
            <span className="text text--1">Save</span>
          </label>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-print"
              className={css['checkbox']}
              type="checkbox"
              name="print"
              checked={toolbarData.buttons.includes('print')}
              onChange={onChange}
            />
            <span className="text text--1">Print</span>
          </label>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-printPreview"
              className={css['checkbox']}
              type="checkbox"
              name="printPreview"
              checked={toolbarData.buttons.includes('printPreview')}
              onChange={onChange}
            />
            <span className="text text--1">Print preview</span>
          </label>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-email"
              className={css['checkbox']}
              type="checkbox"
              name="email"
              checked={toolbarData.buttons.includes('email')}
              onChange={onChange}
            />
            <span className="text text--1">Send in email</span>
          </label>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-undo"
              className={css['checkbox']}
              type="checkbox"
              name="undo"
              checked={toolbarData.buttons.includes('undo')}
              onChange={onChange}
            />
            <span className="text text--1">Undo</span>
          </label>

          <label className={css['label']}>
            <input 
              data-cy="qad-toggle-redo"
              className={css['checkbox']}
              type="checkbox"
              name="redo"
              checked={toolbarData.buttons.includes('redo')}
              onChange={onChange}
            />
            <span className="text text--1">Redo</span>
          </label>

          <div className={css['line']}></div>

          <button 
            className={`text text--1 ${css['button']}`}
            onClick={() => setToolbarData(prev => ({ ...prev, reposition: !prev.reposition }))}
            data-cy="qad-toggle-position"
          >
            <span className={css['checkbox']}></span>
            <span>
              <span className="text--underline">S</span>how {toolbarData.reposition ? 'above' : 'below'} the Ribbon
            </span>
          </button>

          <div className={css['line']}></div>

          <label className={css['label']}>
            <input 
              className={css['checkbox']}
              type="checkbox"
              checked={ribbonData.minimize}
              onChange={() => ribbonData.toggleMinimize()}
              data-cy="qad-toggle-ribbon"
            />
            <span className="text text--1">Mi<span className="text--underline">n</span>imize the Ribbon</span>
          </label>

        </form>
        
      </div>
    </Dropdown>
  );
}

QuickAccessDropdown.propTypes = {
  close: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  toolbarData: PropTypes.object.isRequired,
  setToolbarData: PropTypes.func.isRequired,
  ribbonData: PropTypes.object.isRequired,
};

export default QuickAccessDropdown;