import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import css from './RibbonControls.module.css';

import FileDropdown from '../FileDropdown/FileDropdown';

import info from './assets/info.png';
import { ReactComponent as ArrowUp } from '../../assets/global/arrow-up.svg';

function RibbonControls({ activeRibbonTab, setActiveRibbonTab }) {
  const [showFile, setShowFile] = useState(false);

  useEffect(() => {
    function onPointerDown(event) {
      if(event.target.dataset.file)
        return;

      if(showFile)
        setShowFile(false);
    }

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [showFile]);
  
  return (
    <div className={css['container']}>

      <div className={css['left']}>
        <button
          className="ribbon-button ribbon-button--blue"
          data-file="yes"
          onClick={() => setShowFile(true)}
        >
          File
        </button>
        <button
          className={`ribbon-button ${activeRibbonTab === 'home' ? 'ribbon-button--active' : ''}`}
          onPointerDown={() => setActiveRibbonTab('home')}
        >
          Home
        </button>
        <button
          className={`ribbon-button ribbon-button--last ${activeRibbonTab === 'view' ? 'ribbon-button--active' : ''}`}
          onPointerDown={() => setActiveRibbonTab('view')}
        >
          View
        </button>
      </div>

      <div className={css['right']}>
        <button className="button button--height-20">
          <ArrowUp/>
        </button>
        <button className="button">
          <img draggable="false" src={info} alt="Paint help."/>
        </button>
      </div>

      {showFile && <FileDropdown/>}
      
    </div>
  );
}

RibbonControls.propTypes = {
  activeRibbonTab: PropTypes.oneOf(['home', 'view']),
  setActiveRibbonTab: PropTypes.func,
};


export default RibbonControls;