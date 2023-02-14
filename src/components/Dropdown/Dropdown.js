import React, { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import css from './Dropdown.module.css';

const Dropdown = forwardRef(function Dropdown(props, ref) {
  const { isVisible, classes, children } = props;
  const [isActuallyVisible, setIsActuallyVisible] = useState(isVisible);
  
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
      ref={ref}
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