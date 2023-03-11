import React from 'react';
import css from './RibbonShowOrHide.module.css';

import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';

import { useWindowsContext } from '../../misc/WindowsContext';

function RibbonShowOrHide() {
  const { 
    isStatusBarVisible, setIsStatusBarVisible, isGridLinesVisible,
    setIsGridLinesVisible
  } = useWindowsContext();
  
  return (
    <RibbonItemExpanded name="Show or hide">
      <form className={css['container']}>

        <label className={css['label']}>
          <input 
            type="checkbox"            
          />
          <span className="text text--1">Rulers</span>
        </label>

        <label className={css['label']}>
          <input 
            type="checkbox"
            checked={isGridLinesVisible}
            onChange={() => setIsGridLinesVisible(prev => !prev)}
          />
          <span className="text text--1">Grid lines</span>
        </label>

        <label className={css['label']}>
          <input 
            type="checkbox"
            checked={isStatusBarVisible}
            onChange={() => setIsStatusBarVisible(prev => !prev)}
          />
          <span className="text text--1">Status bar</span>
        </label>

      </form>
    </RibbonItemExpanded>
  );
}

export default RibbonShowOrHide;