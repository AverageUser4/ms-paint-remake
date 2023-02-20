import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './RibbonControls.module.css';

import FileDropdown from '../FileDropdown/FileDropdown';
import useOutsideClick from '../../hooks/useOutsideClick';
import { toggleBoolState } from '../../misc/utils';

import info from './assets/info.png';
import { ReactComponent as ArrowUp } from '../../assets/global/arrow-up.svg';
import pin from '../../assets/global/pin.png';

const RibbonControls = memo(function RibbonControls({ ribbonData }) {
  const dropdownRef = useRef();
  const [isFileDropdownOpen, setIsFileDropdownOpen] = useState(false);
  useOutsideClick(dropdownRef, () => isFileDropdownOpen && setIsFileDropdownOpen(false));

  return (
    <div className={css['container']}>

      <div className={css['left']}>
        <button
          className="ribbon-button ribbon-button--blue"
          onPointerDown={(e) => e.button === 0 && toggleBoolState(isFileDropdownOpen, setIsFileDropdownOpen)}
          data-cy="RibbonControls-toggle-FileDropdown"
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
          onPointerDown={(e) => e.button === 0 && ribbonData.setTab('home')}
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
          onPointerDown={(e) => e.button === 0 && ribbonData.setTab('view')}
        >
          View
        </button>
      </div>

      <div className={css['right']}>
        <button 
          className="button button--height-20"
          onPointerDown={(e) => e.button === 0 && ribbonData.toggleMinimize()}
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

      <FileDropdown ref={dropdownRef} isShown={isFileDropdownOpen} setIsShown={setIsFileDropdownOpen}/>
      
    </div>
  );
});

RibbonControls.propTypes = {
  ribbonData: PropTypes.object.isRequired,
};

export default RibbonControls;