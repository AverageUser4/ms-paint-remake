import React from 'react';
import css from './Tooltip.module.css';
import PropTypes from 'prop-types';

function Tooltip({ heading, text, type = 'specific', top = '100%', left = '0', ID }) {
  return (
    <div
      id={ID}
      className={`tooltip ${css['container']} ${(type === 'generic') && css['container--generic']}`}
      style={{ top, left }}
    >
      {heading && <h4 className="head head--2 head--super-bold">{heading}</h4>}
      <p 
        className={`
          text text--6
          ${(type === 'generic') && 'text--black'}
          ${(typeof heading !== 'undefined') && css['pushed']}
        `}
      >
        {text}
      </p>
    </div>
  );
}

Tooltip.propTypes = {
  heading: PropTypes.string,
  text: PropTypes.string.isRequired,
  type: PropTypes.string,
  top: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  left: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  ID: PropTypes.string
};

export default Tooltip;