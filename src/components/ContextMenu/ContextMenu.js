import React, { useRef } from 'react';
import css from './ContextMenu.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';
import { useContextMenuContext } from '../../misc/ContextMenuContext';

import close from './assets/close.png';
import minimize from './assets/minimize.png';
import maximize from './assets/maximize.png';
import restore from './assets/restore.png';

import clipboard16 from '../../assets/global/clipboard-16.png';
import copy16 from '../../assets/global/copy-16.png';
import cut16 from '../../assets/global/cut-16.png';

function ContextMenu() {
  const { isOpen, setIsOpen, contentType, position } = useContextMenuContext();
  const containerRef = useRef();
  useOutsideClick(containerRef, () => isOpen && setIsOpen(false));
  
  if(!isOpen)
    return null;

  let contents = (<span>no content</span>);
  switch(contentType) {
    case 'window':
      contents = (
        <div className={css['default']}>
          <button className={`${css['button']} ${css['button--disabled']}`}>
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

          <div className={css['line']}></div>

          <button className={`${css['button']} ${css['button--close']}`}>
            <img className={css['icon']} src={close} alt=""/>
            <span>Close</span>
          </button>
        </div>
      );
    break;

    case 'canvas':
      contents = (
        <div className="popup">
          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={cut16} alt=""/>
            <span>Cu<span className="text--underline">t</span></span>
          </button>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={copy16} alt=""/>
            <span><span className="text--underline">C</span>opy</span>
          </button>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={clipboard16} alt=""/>
            <span><span className="text--underline">P</span>aste</span>
          </button>
        </div>
      );
    break;

    default:
      console.error(`de_Invalid menu context contentType provided: "${contentType}".`);
  }
  
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