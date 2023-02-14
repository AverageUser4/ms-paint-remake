import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './RibbonControls.module.css';

import FileDropdown from '../FileDropdown/FileDropdown';

import info from './assets/info.png';
import { ReactComponent as ArrowUp } from '../../assets/global/arrow-up.svg';
import pin from '../../assets/global/pin.png';

function RibbonControls({ ribbonData }) {
  const dropdownRef = useRef();
  const [showFile, setShowFile] = useState(false);

  useEffect(() => {
    function onPointerDown(event) {
      if(
          !dropdownRef.current ||
          dropdownRef.current === event.target ||
          dropdownRef.current.contains(event.target)
        )
        return;

      if(showFile)
        setShowFile(false);
    }

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [showFile]);

  function openFileDropdown() {
    setTimeout(() => setShowFile(true));
  }
  
  return (
    <div className={css['container']}>

      <div className={css['left']}>
        <button
          className="ribbon-button ribbon-button--blue"
          onPointerDown={openFileDropdown}
        >
          File
        </button>
        <button
          className={
            `ribbon-button 
            ${ribbonData.activeTab === 'home' && (!ribbonData.minimize || ribbonData.expand) ? 'ribbon-button--active' : ''}
            ${ribbonData.minimize && !ribbonData.expand ? 'ribbon-button--no-ribbon' : ''}`
          }
          data-control="ribbon"
          onPointerDown={() => ribbonData.setTab('home')}
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
          data-control="ribbon"
          onPointerDown={() => ribbonData.setTab('view')}
        >
          View
        </button>
      </div>

      <div className={css['right']}>
        <button 
          className="button button--height-20"
          onPointerDown={() => ribbonData.toggleMinimize()}
        >
          {
            ribbonData.minimize && ribbonData.expand ?
              <img src={pin} alt=""/>
            :
              <ArrowUp className={ribbonData.minimize ? css['arrow-down'] : ''}/>
          }
        </button>
        <a draggable="false" className="button" rel="noreferrer" target="_blank" href="https://www.bing.com/search?q=pomoc+dotycz%c4%85ca+aplikacji+paint+w+systemie+windows&filters=guid:%224462489-pl-dia%22%20lang:%22pl%22&form=T00032&ocid=HelpPane-BingIA">
          <img draggable="false" src={info} alt="Paint help."/>
        </a>
      </div>

      <FileDropdown ref={dropdownRef} isShown={showFile} setIsShown={setShowFile}/>
      
    </div>
  );
}

RibbonControls.propTypes = {
  ribbonData: PropTypes.object.isRequired,
};

export default RibbonControls;