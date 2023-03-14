import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './RibbonControls.module.css';

import FileDropdown from '../FileDropdown/FileDropdown';
import Tooltip from '../Tooltip/Tooltip';

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
          className="tooltip-container ribbon-button ribbon-button--blue"
          onClick={(e) => e.button === 0 && toggleBoolState(isFileDropdownOpen, setIsFileDropdownOpen)}
          data-cy="RibbonControls-toggle-FileDropdown"
          aria-describedby="id-ribbon-controls-file"
        >
          File
          <Tooltip
            ID="id-ribbon-controls-file"
            heading="Paint"
            text="Click here to open, save, or print and to see everything else you can do with your picture."
          />
        </button>
        <button
          className={
            `ribbon-button 
            ${ribbonData.activeTab === 'home' && (!ribbonData.minimize || ribbonData.expand) ? 'ribbon-button--active' : ''}
            ${ribbonData.minimize && !ribbonData.expand ? 'ribbon-button--no-ribbon' : ''}`
          }
          data-control="ribbon"
          onClick={(e) => e.button === 0 && ribbonData.setTab('home')}
          data-cy="RibbonControls-setTab-home"
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
          onClick={(e) => e.button === 0 && ribbonData.setTab('view')}
          data-cy="RibbonControls-setTab-view"
        >
          View
        </button>
      </div>

      <div className={css['right']}>
        <button 
          className="tooltip-container button button--height-20"
          onClick={(e) => e.button === 0 && ribbonData.toggleMinimize()}
          data-cy="RibbonControls-toggle-Ribbon"
          aria-describedby={`id-ribbon-controls-${ribbonData.minimize ? 'expand' : 'minimize'}`}
        >
          {
            ribbonData.minimize && ribbonData.expand ?
              <img src={pin} alt=""/>
            :
              <ArrowUp className={ribbonData.minimize ? css['arrow-down'] : ''}/>
          }
          {
            ribbonData.minimize ?
              <Tooltip
                ID="id-ribbon-controls-expand"
                heading="Expand the Ribbon (Ctrl+F1)"
                text="Show the Ribbon so that it is always expanded even after you click a command."
              />
            :
              <Tooltip
                ID="id-ribbon-controls-minimize"
                heading="Minimize the Ribbon (Ctrl+F1)"
                text="Show only the tab names on the Ribbon."
              />
          }
        </button>

        <a 
          draggable="false"
          className="tooltip-container button"
          rel="noreferrer"
          target="_blank"
          href="https://github.com/AverageUser4/paint"
          aria-describedby="id-ribbon-controls-help"
        >
          <img draggable="false" src={info} alt="Paint help."/>
          <Tooltip
            ID="id-ribbon-controls-help"
            heading="Paint Help (F1)"
            text="Get help on using Paint."
          />
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