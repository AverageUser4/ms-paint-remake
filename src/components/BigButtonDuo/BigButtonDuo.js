
import React, { useRef } from "react";
import PropTypes from 'prop-types';
import css from './BigButtonDuo.module.css';

import Dropdown from "../Dropdown/Dropdown";

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function BigButtonDuo({ 
  name,
  icon,
  onPointerDownTop,
  onPointerDownBottom,
  children,
  showChildren = false,
  setShowChildren,
  isActive,
}) {
  const dropdownContainerRef = useRef();
  
  return (
    <div 
      className={`${css['container']} ${isActive && css['container--active']}`} 
      ref={dropdownContainerRef}
      data-cy={`BigButtonDuo-${name}`}
    >
      <button 
        className={css['top']}
        onPointerDown={onPointerDownTop ? onPointerDownTop : ()=>0}
      >
        <img draggable="false" className={css['image']} src={icon} alt=""/>
      </button>

      <button 
        className={css['bottom']}
        onPointerDown={onPointerDownBottom ? onPointerDownBottom : ()=>0}
        data-cy={`BigButtonDuo-bottom-${name}`}
      >
        <span className="text text--1">{name}</span>
        <TriangleDown className={css['triangle']}/>
      </button>
      
      {
        children &&
          <Dropdown 
            isVisible={showChildren}
            setIsVisible={setShowChildren}
            dropdownContainerRef={dropdownContainerRef}
          >
            {children}
          </Dropdown>
      }
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
  setShowChildren: PropTypes.func,
  isActive: PropTypes.bool,
};

export default BigButtonDuo;