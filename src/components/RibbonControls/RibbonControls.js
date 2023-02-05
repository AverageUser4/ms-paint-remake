import React from 'react';
import css from './RibbonControls.module.css';

import hide from './assets/hide.png';
import info from './assets/info.png';

function RibbonControls({ activeRibbonTab, setActiveRibbonTab }) {
  
  return (
    <div className={css['container']}>

      <div className={css['left']}>
        <button
          className={`${css['button']} ${css['button--blue']}`}
        >
          File
        </button>
        <button
          className={`${css['button']} ${activeRibbonTab === 'home' ? css['button--active'] : ''}`}
          onPointerDown={() => setActiveRibbonTab('home')}
        >
          Home
        </button>
        <button
          className={`${css['button']} ${css['button--last']} ${activeRibbonTab === 'view' ? css['button--active'] : ''}`}
          onPointerDown={() => setActiveRibbonTab('view')}
        >
          View
        </button>
      </div>

      <div className={css['right']}>
        <button className="button button--height-20">
          <img draggable="false" src={hide} alt="Hide ribbon."/>
        </button>
        <button className="button">
          <img draggable="false" src={info} alt="Paint help."/>
        </button>
      </div>
      
    </div>
  );
}

export default RibbonControls;