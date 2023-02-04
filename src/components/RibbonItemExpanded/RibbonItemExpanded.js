import React from "react";
import css from './RibbonItemExpanded.module.css';

function RibbonItemExpanded({ name, children }) {
  return (
    <div className={css['container']}>

      <div>
        {children}
      </div>

      <h3 className="text text--2">{name}</h3>

    </div>
  );
}

export default RibbonItemExpanded;