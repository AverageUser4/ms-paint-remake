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
import crop16 from '../../assets/global/crop-16.png';
import selectAll16 from '../../assets/global/select-all-16.png';
import invertSelection16 from '../../assets/global/invert-selection-16.png';
import delete16 from '../../assets/global/delete-16.png';
import rotate16 from '../../assets/global/rotate-16.png';
import resize16 from '../../assets/global/resize-16.png';
import invertColor16 from '../../assets/global/invert-color-16.png';

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

          <div className="popup__line popup__line--separator"></div>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={crop16} alt=""/>
            <span>C<span className="text--underline">r</span>op</span>
          </button>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={selectAll16} alt=""/>
            <span>Select <span className="text--underline">a</span>ll</span>
          </button>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={invertSelection16} alt=""/>
            <span><span className="text--underline">I</span>nvert selection</span>
          </button>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={delete16} alt=""/>
            <span><span className="text--underline">D</span>elete</span>
          </button>

          <div className="popup__line popup__line--separator"></div>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={rotate16} alt=""/>
            <span>R<span className="text--underline">o</span>tate</span>
          </button>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={resize16} alt=""/>
            <span>Re<span className="text--underline">s</span>ize</span>
          </button>

          <button className="popup__button text text--4 text--nowrap">
            <img draggable="false" className="popup__image" src={invertColor16} alt=""/>
            <span>Inv<span className="text--underline">e</span>rt color</span>
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