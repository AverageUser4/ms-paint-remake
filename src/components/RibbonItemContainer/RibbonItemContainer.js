import React, { useEffect, useRef, useState } from "react";
import css from './RibbonItemContainer.module.css';
import triangleDown from '../../assets/global/triangle-down.png';

function RibbonItemContainer({ icon, name, children, showContent }) {
  const containerRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if(showDropdown && showContent)
      setShowDropdown(false);
  }, [showDropdown, showContent]);

  useEffect(() => {
    function onMouseDown(event) {
      if(
          !containerRef.current ||
          containerRef.current === event.target ||
          containerRef.current.contains(event.target)
        )
        return;
      
      if(showDropdown)
        setShowDropdown(false);
    }

    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
    };
  }, [showDropdown]);
  
  if(showContent)
    return children;
  
  return (
    <div 
      className={`${css['container']} ${showDropdown ? css['container--active'] : ''}`}
      ref={containerRef}
    >

      <button className={css['button']} onClick={() => setShowDropdown(prev => !prev)}>

        <div className={css['image-container']}>
          <img draggable="false" src={icon} alt=""/>
        </div>

        <span className="text text--1">{name}</span>

        <img draggable="false" className={css['triangle']} src={triangleDown} alt=""/>

      </button>

      {
        showDropdown &&
          <div className={css['dropdown']}>
            {children}
          </div>
      }
      
    </div>
  );
}

export default RibbonItemContainer;