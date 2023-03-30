import React, { memo, useRef } from 'react';
import css from './ContextMenu.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';
import { useContextMenuContext } from '../../context/ContextMenuContext';
import { useWindowsContext } from '../../context/WindowsContext';
import { useSelectionContext } from '../../context/SelectionContext';

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
import rotate18016 from '../../assets/global/rotate-180-16.png';
import filpHorizontal16 from '../../assets/global/flip-horizontal-16.png';
import filpVertical16 from '../../assets/global/flip-vertical-16.png';
import rotateLeft16 from '../../assets/global/rotate-left-16.png';
import { ReactComponent as ArrowRight } from '../../assets/global/arrow-right.svg';

const ContextMenu = memo(function ContextMenu() {
  const { setIsResizeWindowOpen } = useWindowsContext();
  const { isOpen, setIsOpen, contentType, position, data } = useContextMenuContext();
  const { 
    doSelectionPasteFromClipboard, doSelectionCrop, doSharedCut, doSharedCopy,
    doSelectionSelectAll, doSelectionInvertSelection, doSharedDelete,
    doSharedRotate, doSharedFlip, doSharedInvertColor
  } = useSelectionContext();
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
      if(data !== 'primary' && data !== 'selection') {
        console.error(`When "contentType" used in openContext menu is "canvas", data has to be string either ov value "primary" or "selection", provided data is: "${data}".`);
      }
      contents = (
        <div className="popup">
          <div className="popup__part">

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                doSharedCut();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={cut16} alt=""/>
              <span>Cu<span className="text--underline">t</span></span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                doSharedCopy();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={copy16} alt=""/>
              <span><span className="text--underline">C</span>opy</span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                doSelectionPasteFromClipboard();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={clipboard16} alt=""/>
              <span><span className="text--underline">P</span>aste</span>
            </button>

            <div className="popup__line popup__line--separator"></div>

            <button 
              disabled={data === 'primary'}
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                doSelectionCrop();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={crop16} alt=""/>
              <span>C<span className="text--underline">r</span>op</span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                doSelectionSelectAll();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={selectAll16} alt=""/>
              <span>Select <span className="text--underline">a</span>ll</span>
            </button>

            <button 
              disabled={data === 'primary'}
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                doSelectionInvertSelection();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={invertSelection16} alt=""/>
              <span><span className="text--underline">I</span>nvert selection</span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                doSharedDelete();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={delete16} alt=""/>
              <span><span className="text--underline">D</span>elete</span>
            </button>

            <div className="popup__line popup__line--separator"></div>

            <div tabIndex="0" className="popup__button text text--4 text--nowrap">
              <img draggable="false" className="popup__image" src={rotate16} alt=""/>
              <span>R<span className="text--underline">o</span>tate</span>
              <ArrowRight className="popup__button__arrow"/>

              <div 
                className="popup popup--inner"
              >
                <div className="popup__part">
                  <button
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSharedRotate(90);
                      setIsOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={rotate16} alt=""/>
                    <span>Rotate <span className="text--underline">r</span>ight 90°</span>
                  </button>

                  <button
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSharedRotate(-90);
                      setIsOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={rotateLeft16} alt=""/>
                    <span>Rotate <span className="text--underline">l</span>eft 90°</span>
                  </button>

                  <button
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSharedRotate(180);
                      setIsOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={rotate18016} alt=""/>
                    <span>Ro<span className="text--underline">t</span>ate 180°</span>
                  </button>

                  <button
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSharedFlip('vertical');
                      setIsOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={filpVertical16} alt=""/>
                    <span>Flip <span className="text--underline">v</span>ertical</span>
                  </button>

                  <button
                    className="popup__button text text--4 text--nowrap"
                    onClick={() => {
                      doSharedFlip('horizontal');
                      setIsOpen(false);
                    }}
                  >
                    <img draggable="false" className="popup__image" src={filpHorizontal16} alt=""/>
                    <span>Flip <span className="text--underline">h</span>orizontal</span>
                  </button>
                </div>
              </div>
            </div>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                setIsResizeWindowOpen(true);
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={resize16} alt=""/>
              <span>Re<span className="text--underline">s</span>ize</span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {                
                doSharedInvertColor();
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={invertColor16} alt=""/>
              <span>Inv<span className="text--underline">e</span>rt color</span>
            </button>
          </div>
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
});

export default ContextMenu;