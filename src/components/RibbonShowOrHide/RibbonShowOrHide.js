import React from 'react';
import css from './RibbonShowOrHide.module.css';

import RibbonItemExpanded from '../RibbonItemExpanded/RibbonItemExpanded';

function RibbonShowOrHide() {
  return (
    <RibbonItemExpanded name="Show or hide">
      <form className={css['container']}>

        <label className={css['label']}>
          <input type="checkbox"/>
          <span className="text text--1">Rulers</span>
        </label>

        <label className={css['label']}>
          <input type="checkbox"/>
          <span className="text text--1">Grid lines</span>
        </label>

        <label className={css['label']}>
          <input type="checkbox"/>
          <span className="text text--1">Status bar</span>
        </label>

      </form>
    </RibbonItemExpanded>
  );
}

export default RibbonShowOrHide;