import React, { useState, useEffect, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import css from './Dropdown.module.css';

import { useContainerContext } from '../../misc/ContainerProvider';

const Dropdown = forwardRef(function Dropdown(props, ref) {
  const { containerRef, containerDimensions } = useContainerContext();
  const dropdownRef = useRef();
  const [position, setPosition] = useState({ left: 0, right: 'auto' });
  const { isVisible, classes, children } = props;
  const [isActuallyVisible, setIsActuallyVisible] = useState(isVisible);
  
  useEffect(() => {
    if(!containerRef.current || !dropdownRef.current)
      return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    console.log(dropdownRect.right > containerRect.right)
    
    if(position.left === 0 && dropdownRect.right > containerRect.right) {
      setPosition({ left: 'auto', right: 0 });
    }
    else if(position.right === 0 && dropdownRect.left < containerRect.left) {
      setPosition({ left: 0, right: 'auto' });
    }

    /*
      - make it worth also for height and add more sensible adjustments
    */
  });
  
  console.log(position)
  
  useEffect(() => {
    if(isVisible && !isActuallyVisible)
      setIsActuallyVisible(true);
    if(!isVisible && isActuallyVisible)
      setTimeout(() => setIsActuallyVisible(false), 300);
  }, [isVisible, isActuallyVisible]);

  if(!isActuallyVisible)
    return null;
  
  return (
    <div className={`
        ${css['dropdown']}
        ${!isVisible ? css['dropdown--hidden'] : ''}
        ${classes ? classes : ''}
      `}
      ref={(element) => {
        if(ref)
          ref.current = element;
        dropdownRef.current = element;
      }}
      style={position}
    >
      {children}
    </div>
  );
});

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  classes: PropTypes.string
}

export default Dropdown;