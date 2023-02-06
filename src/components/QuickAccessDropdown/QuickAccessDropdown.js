import React, { useState } from 'react';
import css from './QuickAccessDropdown.module.css';

function QuickAccessDropdown() {
  return (
    <div className={css['container']}>
      
      <div className={css['top']}>
        <h3 className="head head--dark">Customize Quick Access Toolbar</h3>
      </div>

      <form className="text text--1">

        <label>
          <input type="checkbox"/>
          <span>New</span>
        </label>

        <label>
          <input type="checkbox"/>
          <span>Open</span>
        </label>

        <label>
          <input type="checkbox"/>
          <span>Save</span>
        </label>

        <label>
          <input type="checkbox"/>
          <span>Print</span>
        </label>

        <label>
          <input type="checkbox"/>
          <span>Print preview</span>
        </label>

        <label>
          <input type="checkbox"/>
          <span>Send in email</span>
        </label>

        <label>
          <input type="checkbox"/>
          <span>Undo</span>
        </label>

        <label>
          <input type="checkbox"/>
          <span>Redo</span>
        </label>

        <button>
          <span className="text--underline">S</span>how below the Ribbon
        </button>

        <label>
          <input type="checkbox"/>
          <span>Mi<span className="text--underline">n</span>imize the Ribbon</span>
        </label>

      </form>
      
    </div>
  );
}

export default QuickAccessDropdown;