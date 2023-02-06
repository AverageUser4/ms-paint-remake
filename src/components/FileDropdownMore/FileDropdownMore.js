import React from 'react';
import css from './FileDropdownMore.module.css';

function FileDropdownMore({ currentMore }) {
  return (
    <div className={css['container']}>

      <div className={css['top']}>
        <h3 className="head">Recent pictures</h3>
      </div>

      <ul className="clean-list">

        <li>
          <button className={`${css['file-button']} text text--1`}><span className="text--underline">1</span>file.png</button>
        </li>

        <li>
          <button className={`${css['file-button']} text text--1`}><span className="text--underline">2</span>important.jpg</button>
        </li>

      </ul>
      
    </div>
  );
}

export default FileDropdownMore;