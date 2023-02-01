import React from 'react';
import css from './RibbonControls.module.css';
import hide from '../../assets/RibbonControls/hide.png';
import info from '../../assets/RibbonControls/info.png';

function RibbonControls() {
  return (
    <div className={css['container']}>

      <div className={css['left']}>
        <button className={`${css['button']} ${css['button--blue']}`}>File</button>
        <button className={`${css['button']} ${css['button--active']}`}>Home</button>
        <button className={`${css['button']} ${css['button--last']}`}>View</button>
      </div>

      <div className={css['right']}>
        <button className="button">
          <img src={hide} alt="Hide ribbon."/>
        </button>
        <button className="button">
          <img src={info} alt="Paint help."/>
        </button>
      </div>
      
    </div>
  );
}

export default RibbonControls;