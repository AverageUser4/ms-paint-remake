import React from 'react';
import PropTypes from 'prop-types';
import css from './QuickAccessDropdown.module.css';

function QuickAccessDropdown({ isVisible, close, availableButtons, setAvailableButtons, repositionToolbar, setRepositionToolbar, hideRibbon, setHideRibbon }) {
  function onChange(event) {
    const { name } = event.target;
    
    setAvailableButtons(prev => {
      if(prev.includes(name))
        return prev.filter(item => item !== name);
      
      return [...prev, name];
    });
  }

  return (
    <div className={`${css['container']} ${!isVisible ? css['container--hidden'] : ''}`}>
      
      <div className={css['top']}>
        <h3 className="head head--dark">Customize Quick Access Toolbar</h3>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className={css['form']} onClick={close}>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="newFile"
            checked={availableButtons.includes('newFile')}
            onChange={onChange}
          />
          <span className="text text--1">New</span>
        </label>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="open"
            checked={availableButtons.includes('open')}
            onChange={onChange}
          />
          <span className="text text--1">Open</span>
        </label>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="save"
            checked={availableButtons.includes('save')}
            onChange={onChange}
          />
          <span className="text text--1">Save</span>
        </label>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="print"
            checked={availableButtons.includes('print')}
            onChange={onChange}
          />
          <span className="text text--1">Print</span>
        </label>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="printPreview"
            checked={availableButtons.includes('printPreview')}
            onChange={onChange}
          />
          <span className="text text--1">Print preview</span>
        </label>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="email"
            checked={availableButtons.includes('email')}
            onChange={onChange}
          />
          <span className="text text--1">Send in email</span>
        </label>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="undo"
            checked={availableButtons.includes('undo')}
            onChange={onChange}
          />
          <span className="text text--1">Undo</span>
        </label>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            name="redo"
            checked={availableButtons.includes('redo')}
            onChange={onChange}
          />
          <span className="text text--1">Redo</span>
        </label>

        <div className={css['line']}></div>

        <button className={`text text--1 ${css['button']}`} onClick={() => setRepositionToolbar(prev => !prev)}>
          <span className={css['checkbox']}></span>
          <span>
            <span className="text--underline">S</span>how {repositionToolbar ? 'above' : 'below'} the Ribbon
          </span>
        </button>

        <div className={css['line']}></div>

        <label className={css['label']}>
          <input 
            className={css['checkbox']}
            type="checkbox"
            checked={hideRibbon}
            onChange={() => setHideRibbon(prev => !prev)}
          />
          <span className="text text--1">Mi<span className="text--underline">n</span>imize the Ribbon</span>
        </label>

      </form>
      
    </div>
  );
}

QuickAccessDropdown.propTypes = {
  close: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  availableButtons: PropTypes.array.isRequired,
  setAvailableButtons: PropTypes.func.isRequired,
  repositionToolbar: PropTypes.bool.isRequired,
  setRepositionToolbar: PropTypes.func.isRequired,
  hideRibbon: PropTypes.bool.isRequired,
  setHideRibbon: PropTypes.func.isRequired,
};

export default QuickAccessDropdown;