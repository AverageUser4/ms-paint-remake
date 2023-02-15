import React, { useRef } from 'react';
import css from './ContextMenu.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';
import { useContextMenuContext } from '../../misc/ContextMenuContext';

import close from './assets/close.png';
import minimize from './assets/minimize.png';
import maximize from './assets/maximize.png';
import restore from './assets/restore.png';

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
      {
        contents ?
          contents
        :
          <div className={css['default']}>
            <button className={`${css['button']}`}>
              <img className={css['icon']} src={restore} alt=""/>
              <span>Restore</span>
            </button>

            <button className={`${css['button']}`}>
              <span className={css['icon']}></span>
              <span>Move</span>
            </button>

            <button className={`${css['button']}`}>
              <span className={css['icon']}></span>
              <span>Size</span>
            </button>

            <button className={`${css['button']}`}>
              <img className={css['icon']} src={minimize} alt=""/>
              <span>Minimize</span>
            </button>

            <button className={`${css['button']}`}>
              <img className={css['icon']} src={maximize} alt=""/>
              <span>Maximize</span>
            </button>

            <button className={`${css['button']}`}>
              <img className={css['icon']} src={close} alt=""/>
              <span>Close</span>
            </button>
          </div>
      }
    </div>
  )
}

export default ContextMenu;