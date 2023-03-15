import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import css from './QuickAccessDropdown.module.css';

import Dropdown from '../Dropdown/Dropdown';
import Tooltip from '../Tooltip/Tooltip';

const QuickAccessDropdown = memo(function QuickAccessDropdown({ 
  isOpen,
  setIsOpen,
  toolbarData,
  setToolbarData,
  ribbonData
}) {
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
      isVisible={isOpen} 
      setIsVisible={setIsOpen}
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

        <form 
          onSubmit={(e) => e.preventDefault()}
          className={css['form']}
          onClick={() => setIsOpen(false)}
        >

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-newFile"
              className={css['checkbox']}
              type="checkbox"
              name="newFile"
              checked={toolbarData.buttons.includes('newFile')}
              onChange={onChange}
              aria-describedby="id-qad-new-file"
            />
            <span className="text text--1">New</span>
            <Tooltip
              ID="id-qad-new-file"
              left="32px"
              text={toolbarData.buttons.includes('newFile') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-open"
              className={css['checkbox']}
              type="checkbox"
              name="open"
              checked={toolbarData.buttons.includes('open')}
              onChange={onChange}
              aria-describedby="id-qad-open"
            />
            <span className="text text--1">Open</span>
            <Tooltip
              ID="id-qad-open"
              left="32px"
              text={toolbarData.buttons.includes('open') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-save"
              className={css['checkbox']}
              type="checkbox"
              name="save"
              checked={toolbarData.buttons.includes('save')}
              onChange={onChange}
              aria-describedby="id-qad-save"
            />
            <span className="text text--1">Save</span>
            <Tooltip
              ID="id-qad-save"
              left="32px"
              text={toolbarData.buttons.includes('save') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-print"
              className={css['checkbox']}
              type="checkbox"
              name="print"
              checked={toolbarData.buttons.includes('print')}
              onChange={onChange}
              aria-describedby="id-qad-print"
            />
            <span className="text text--1">Print</span>
            <Tooltip
              ID="id-qad-print"
              left="32px"
              text={toolbarData.buttons.includes('print') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-printPreview"
              className={css['checkbox']}
              type="checkbox"
              name="printPreview"
              checked={toolbarData.buttons.includes('printPreview')}
              onChange={onChange}
              aria-describedby="id-qad-print-preview"
            />
            <span className="text text--1">Print preview</span>
            <Tooltip
              ID="id-qad-print-preview"
              left="32px"
              text={toolbarData.buttons.includes('printPreview') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-email"
              className={css['checkbox']}
              type="checkbox"
              name="email"
              checked={toolbarData.buttons.includes('email')}
              onChange={onChange}
              aria-describedby="id-qad-email"
            />
            <span className="text text--1">Send in email</span>
            <Tooltip
              ID="id-qad-email"
              left="32px"
              text={toolbarData.buttons.includes('email') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-undo"
              className={css['checkbox']}
              type="checkbox"
              name="undo"
              checked={toolbarData.buttons.includes('undo')}
              onChange={onChange}
              aria-describedby="id-qad-undo"
            />
            <span className="text text--1">Undo</span>
            <Tooltip
              ID="id-qad-undo"
              left="32px"
              text={toolbarData.buttons.includes('undo') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <label className={`tooltip-container ${css['label']}`}>
            <input 
              data-cy="QuickAccessDropdown-toggle-element-redo"
              className={css['checkbox']}
              type="checkbox"
              name="redo"
              checked={toolbarData.buttons.includes('redo')}
              onChange={onChange}
              aria-describedby="id-qad-redo"
            />
            <span className="text text--1">Redo</span>
            <Tooltip
              ID="id-qad-redo"
              left="32px"
              text={toolbarData.buttons.includes('redo') ? 
                'Remove from Quick Access Toolbar' :
                'Add to Qucik Access Toolbar'}
            />
          </label>

          <div className={css['line']}></div>

          <button 
            className={`text text--1 ${css['button']}`}
            onClick={() => setToolbarData(prev => ({ ...prev, reposition: !prev.reposition }))}
            data-cy="QuickAccessDropdown-toggle-position"
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
              data-cy="QuickAccessDropdown-toggle-Ribbon"
            />
            <span className="text text--1">Mi<span className="text--underline">n</span>imize the Ribbon</span>
          </label>

        </form>
        
      </div>
    </Dropdown>
  );
});

QuickAccessDropdown.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func,
  toolbarData: PropTypes.object.isRequired,
  setToolbarData: PropTypes.func.isRequired,
  ribbonData: PropTypes.object.isRequired,
};

export default QuickAccessDropdown;