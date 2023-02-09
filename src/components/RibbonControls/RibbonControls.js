import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import css from './RibbonControls.module.css';

import FileDropdown from '../FileDropdown/FileDropdown';

import info from './assets/info.png';
import { ReactComponent as ArrowUp } from '../../assets/global/arrow-up.svg';
import pin from '../../assets/global/pin.png';

function RibbonControls({ ribbonData, setRibbonData }) {
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
          className={
            `ribbon-button 
            ${ribbonData.activeTab === 'home' && (!ribbonData.minimize || ribbonData.expand) ? 'ribbon-button--active' : ''}
            ${ribbonData.minimize && !ribbonData.expand ? 'ribbon-button--no-ribbon' : ''}`
          }
          onPointerDown={() => setRibbonData(prev => ({ ...prev, activeTab: 'home', expand: true }))}
          data-ribbonexpand="1"
        >
          Home
        </button>
        <button
          className={`
            ribbon-button 
            ribbon-button--last
            ${ribbonData.activeTab === 'view' && (!ribbonData.minimize || ribbonData.expand) ? 'ribbon-button--active' : ''}
            ${ribbonData.minimize && !ribbonData.expand ? 'ribbon-button--no-ribbon' : ''}`
          }
          onPointerDown={() => setRibbonData(prev => ({ ...prev, activeTab: 'view', expand: true }))}
          data-ribbonexpand="1"
        >
          View
        </button>
      </div>

      <div className={css['right']}>
        <button 
          className="button button--height-20"
          onClick={() => setRibbonData(prev => ({ ...prev, minimize: !prev.minimize, expand: false }))}
          data-ribbonexpand="1"
        >
          {
            ribbonData.minimize && ribbonData.expand ?
              <img data-ribbonexpand="1" src={pin} alt=""/>
            :
              <ArrowUp data-ribbonexpand="1" className={ribbonData.minimize ? css['arrow-down'] : ''}/>
          }
        </button>
        <button className="button">
          <img draggable="false" src={info} alt="Paint help."/>
        </button>
      </div>

      <FileDropdown show={showFile} setShow={setShowFile}/>
      
    </div>
  );
}

RibbonControls.propTypes = {
  ribbonData: PropTypes.object.isRequired,
  setRibbonData: PropTypes.func.isRequired,
};


export default RibbonControls;