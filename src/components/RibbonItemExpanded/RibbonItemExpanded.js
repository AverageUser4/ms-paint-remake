import React from "react";
import PropTypes from "prop-types";
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

RibbonItemExpanded.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};

export default RibbonItemExpanded;