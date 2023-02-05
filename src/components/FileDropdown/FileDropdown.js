import React from 'react';
import css from './FileDropdown.module.css';

function FileDropdown() {
  return (
    <div className={css['container']}>

      <div className={css['top']}>
        <button className="ribbon-button ribbon-button--blue">File</button>
      </div>

      <div className={css['middle']}>
        <div className={css['left']}></div>
        <div className={css['right']}></div>
      </div>

      <div className={css['bottom']}></div>

    </div>
  );
}

export default FileDropdown;