import React from "react";
import css from './Clipboard.module.css';
import paste from '../../assets/Ribbon/paste.png';

function Clipboard() {
  return (
    <button className={css['container']}>

      <div className={css['image-container']}>
        <img src={paste}/>
      </div>

      <span className="text text--ribbon-item">Clipboard</span>

    </button>
  );
}

export default Clipboard;