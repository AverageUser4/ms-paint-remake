import React from "react";
import PropTypes from "prop-types";
import css from './RibbonItemExpanded.module.css';

function RibbonItemExpanded({ name, children }) {
  return (
    <div 
      className={css['container']}
      data-cy={`RibbonItemExpanded-${name}`}
    >

      <div>
        {children}
      </div>

      <h3 className="text text--2 text--centered">{name}</h3>

    </div>
  );
}

RibbonItemExpanded.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default RibbonItemExpanded;