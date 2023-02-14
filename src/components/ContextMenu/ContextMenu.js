import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './ContextMenu.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';
import { useContextMenuContext } from '../../misc/ContextMenuContext';

function ContextMenu() {
  const { isOpen, setIsOpen, contents, position } = useContextMenuContext();
  const containerRef = useRef();
  useOutsideClick(containerRef, () => isOpen && setIsOpen(false));
  
  if(!isOpen)
    return null;
  
  return (
    <div 
      className={css['container']} 
      ref={containerRef}
      style={{ left: position.x, top: position.y }}
    >
      {contents}
    </div>
  )
}

export default ContextMenu;