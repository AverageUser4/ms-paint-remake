import React from 'react';
import PropTypes from 'prop-types';
import css from './QuickAccessDropdown.module.css';

function QuickAccessDropdown({ isVisible, close }) {
  return (
    <div className={`${css['container']} ${!isVisible ? css['container--hidden'] : ''}`}>
      
      <div className={css['top']}>
        <h3 className="head head--dark">Customize Quick Access Toolbar</h3>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className={css['form']} onClick={close}>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">New</span>
        </label>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Open</span>
        </label>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Save</span>
        </label>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Print</span>
        </label>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Print preview</span>
        </label>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Send in email</span>
        </label>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Undo</span>
        </label>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Redo</span>
        </label>

        <div className={css['line']}></div>

        <button className={`text text--1 ${css['button']}`}>
          <span className={css['checkbox']}></span>
          <span>
            <span className="text--underline">S</span>how below the Ribbon
          </span>
        </button>

        <div className={css['line']}></div>

        <label className={css['label']}>
          <input className={css['checkbox']} type="checkbox"/>
          <span className="text text--1">Mi<span className="text--underline">n</span>imize the Ribbon</span>
        </label>

      </form>
      
    </div>
  );
}

QuickAccessDropdown.propTypes = {
  close: PropTypes.func,
  isVisible: PropTypes.bool
};

export default QuickAccessDropdown;