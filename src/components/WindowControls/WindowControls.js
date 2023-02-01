import React from "react";
import css from './WindowControls.module.css';
import minimize from  '../../assets/WindowControls/minimize.png';
import maximize from  '../../assets/WindowControls/maximize.png';
import close from  '../../assets/WindowControls/close.png';


function WindowControls() {
  return (
    <div className={css['container']}>
      <button>
        <img src={minimize} alt="Minimize."/>
      </button>
      <button>
        <img src={maximize} alt="Maximize."/>
      </button>
      <button>
        <img src={close} alt="Close."/>
      </button>
    </div>  
  );
}

export default WindowControls;
