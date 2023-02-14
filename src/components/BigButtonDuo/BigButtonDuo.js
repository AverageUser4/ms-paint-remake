
import React from "react";
import PropTypes from 'prop-types';
import css from './BigButtonDuo.module.css';

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButtonDuo({ name, icon, onPointerDownTop, onPointerDownBottom, children, showChildren }) {
  return (
    <div className={css['container']}>
      <button 
        className={css['top']}
        onPointerDown={onPointerDownTop ? onPointerDownTop : ()=>0}
      >
        <img draggable="false" className={css['image']} src={icon} alt=""/>
      </button>

      <button 
        className={css['bottom']}
        onPointerDown={onPointerDownBottom ? onPointerDownBottom : ()=>0}
      >
        <span className="text text--1">{name}</span>
        <TriangleDown className={css['triangle']}/>
      </button>
      
      <div className={`dropdown ${!showChildren ? 'dropdown--hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
}

BigButtonDuo.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onPointerDownTop: PropTypes.func,
  onPointerDownBottom: PropTypes.func,
  children: PropTypes.node,
  showChildren: PropTypes.bool,
};

export default BigButtonDuo;