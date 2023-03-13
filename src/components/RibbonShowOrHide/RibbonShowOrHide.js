import React from 'react';
import css from './RibbonShowOrHide.module.css';

import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';
import Tooltip from '../Tooltip/Tooltip';

import { useWindowsContext } from '../../misc/WindowsContext';

function RibbonShowOrHide() {
  const { 
    isStatusBarVisible, setIsStatusBarVisible, isGridLinesVisible,
    setIsGridLinesVisible, isRulersVisible, setIsRulersVisible,
  } = useWindowsContext();
  
  return (
    <RibbonItemExpanded name="Show or hide">
      <form className={css['container']}>

        <label className={`tooltip-container ${css['label']}`}>
          <input
            type="checkbox"            
            checked={isRulersVisible}
            onChange={() => setIsRulersVisible(prev => !prev)}
            aria-describedby="id-show-or-hide-rulers"
          />
          <span className="text text--1">Rulers</span>
          <Tooltip
            ID="id-show-or-hide-rulers"
            heading="Rulers (Ctrl+R)"
            text="View and use rulers to line up and measure objects in the picture."
          />
        </label>

        <label className={`tooltip-container ${css['label']}`}>
          <input
            type="checkbox"
            checked={isGridLinesVisible}
            onChange={() => setIsGridLinesVisible(prev => !prev)}
            aria-describedby="id-show-or-hide-grid-lines"
          />
          <span className="text text--1">Grid lines</span>
          <Tooltip
            ID="id-show-or-hide-grid-lines"
            heading="Gridlines (Ctrl+G)"
            text="View and use gridlines to align objects in your picture."
          />
        </label>

        <label className={`tooltip-container ${css['label']}`}>
          <input
            type="checkbox"
            checked={isStatusBarVisible}
            onChange={() => setIsStatusBarVisible(prev => !prev)}
            aria-describedby="id-show-or-hide-status-bar"
          />
          <span className="text text--1">Status bar</span>
          <Tooltip
            ID="id-show-or-hide-status-bar"
            heading="Status bar"
            text="Show or hide status bar at the bottom of the window."
          />
        </label>

      </form>
    </RibbonItemExpanded>
  );
}

export default RibbonShowOrHide;