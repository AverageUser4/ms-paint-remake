import React from "react";
import PropTypes from 'prop-types';
import css from './WindowControls.module.css';

import { ReactComponent as Close } from './assets/close.svg';
import { ReactComponent as Maximize } from './assets/maximize.svg';
import { ReactComponent as Minimize } from './assets/minimize.svg';

function WindowControls({ windowHasFocus }) {
  return (
    <div className={css['container']}>
      <button className={`${css['button']} ${!windowHasFocus ? css['button--disabled'] : ''}`}>
        <Minimize draggable="false"/>
      </button>
      <button className={`${css['button']} ${!windowHasFocus ? css['button--disabled'] : ''}`}>
        <Maximize draggable="false"/>
      </button>
      <button className={`${css['button']} ${css['button--danger']} ${!windowHasFocus ? css['button--disabled'] : ''}`}>
        <Close draggable="false"/>
      </button>
    </div>  
  );
}

WindowControls.propTypes = {
  windowHasFocus: PropTypes.bool
};

export default WindowControls;
