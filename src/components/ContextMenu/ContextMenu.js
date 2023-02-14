import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './ContextMenu.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';

function ContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef();
  useOutsideClick(containerRef, () => isOpen && setIsOpen(false));
  
  if(!isOpen)
    return null;
  
  return (
    <div className={css['container']} ref={containerRef}>

    </div>
  )
}

export default ContextMenu;