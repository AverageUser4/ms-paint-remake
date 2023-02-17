import React, { useState, useEffect, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import css from './Dropdown.module.css';

import { useContainerContext } from '../../misc/ContainerProvider';

const Dropdown = forwardRef(function Dropdown(props, ref) {
  const { isVisible, classes, children, adjustPosition = true, dropdownContainerRef } = props;
  const { containerRef: paintContainerRef, containerDimensions: paintContainerDimensions } = useContainerContext();
  const dropdownRef = useRef();
  const [position, setPosition] = useState(adjustPosition ? { left: 0, right: 'auto', top: '100%', bottom: 'auto' } : {});
  const [isActuallyVisible, setIsActuallyVisible] = useState(isVisible);
  const [isPositionAdjusted, setIsPositionAdjusted] = useState(false);
  
  useEffect(() => {
    if(isVisible && !isActuallyVisible) {
      setIsActuallyVisible(true);
      setIsPositionAdjusted(false);
    }
    if(!isVisible && isActuallyVisible)
      setTimeout(() => setIsActuallyVisible(false), 300);
  }, [isVisible, isActuallyVisible]);

  useEffect(() => {
    if(!adjustPosition || !dropdownContainerRef || !paintContainerRef.current || !dropdownRef.current)
      return;

    const paintContainerRect = paintContainerRef.current.getBoundingClientRect();
    const dropdownContainerRect = dropdownContainerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();

    if(position.left === 0 && dropdownRect.right > paintContainerRect.right) {
      setPosition(prev => ({ ...prev, left: 'auto', right: 0 }));
    }
    else if(position.right === 0 && dropdownRect.right + dropdownRect.width < paintContainerRect.right) {
      setPosition(prev => ({ ...prev, left: 0, right: 'auto' }));
    }

    if(position.top === '100%' && dropdownRect.bottom > paintContainerRect.bottom) {
      setPosition(prev => ({ ...prev, top: 'auto', bottom: '100%' }));
    }
    else if(position.bottom === '100%' && dropdownRect.bottom + dropdownRect.height + dropdownContainerRect.height < paintContainerRect.bottom) {
      setPosition(prev => ({ ...prev, top: '100%', bottom: 'auto' }));
    }

    if(!isPositionAdjusted)
      setIsPositionAdjusted(true);
  }, [paintContainerDimensions, paintContainerRef, position, isActuallyVisible, adjustPosition, dropdownContainerRef, isPositionAdjusted]);

  if(!isActuallyVisible)
    return null;
  
  return (
    <div className={`
        ${css['dropdown']}
        ${!isVisible || !isPositionAdjusted ? css['dropdown--hidden'] : ''}
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
  classes: PropTypes.string,
  adjustPosition: PropTypes.bool,
  dropdownContainerRef: PropTypes.object,
}

export default Dropdown;