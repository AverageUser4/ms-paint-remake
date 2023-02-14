import React, { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import css from './RibbonItemContainer.module.css';

import { ReactComponent as TriangleDown } from '../../assets/global/triangle-down.svg';

function RibbonItemContainer({ icon, name, children, isOnlyContent }) {
  const containerRef = useRef();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if(isDropdownOpen && isOnlyContent)
      setIsDropdownOpen(false);
  }, [isDropdownOpen, isOnlyContent]);

  useEffect(() => {
    function onPointerDown(event) {
      if(
          !containerRef.current ||
          containerRef.current === event.target ||
          containerRef.current.contains(event.target)
        )
        return;
      
      if(isDropdownOpen)
        setIsDropdownOpen(false);
    }

    window.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isDropdownOpen]);
  
  if(isOnlyContent)
    return children;
  
  return (
    <div 
      className={`${css['container']} ${isDropdownOpen ? css['container--active'] : ''}`}
      ref={containerRef}
    >

      <button className={css['button']} onClick={() => setIsDropdownOpen(prev => !prev)}>

        <div className={css['image-container']}>
          <img draggable="false" src={icon} alt=""/>
        </div>

        <span className="text text--1">{name}</span>

        <TriangleDown className={css['triangle']}/>

      </button>

      <div className={`${css['dropdown']} ${!isDropdownOpen ? css['dropdown--hidden'] : ''}`}>
        {children}
      </div>

    </div>
  );
}

RibbonItemContainer.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOnlyContent: PropTypes.bool.isRequired,
};

export default RibbonItemContainer;