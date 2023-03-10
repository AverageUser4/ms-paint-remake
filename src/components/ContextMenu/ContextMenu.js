import React, { useRef } from 'react';
import css from './ContextMenu.module.css';

import useOutsideClick from '../../hooks/useOutsideClick';
import { useContextMenuContext } from '../../misc/ContextMenuContext';
import { useWindowsContext } from '../../misc/WindowsContext';
import { useSelectionContext } from '../../misc/SelectionContext';
import { useCanvasContext } from '../../misc/CanvasContext';
import { useHistoryContext } from '../../misc/HistoryContext';

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
import { doGetCanvasCopy, writeCanvasToClipboard, ImageDataUtils } from '../../misc/utils';

function ContextMenu() {
  const { setIsResizeWindowOpen } = useWindowsContext();
  const { isOpen, setIsOpen, contentType, position, data } = useContextMenuContext();
  const { 
    selectionPhase, setSelectionPhase, selectionRef,
    selectionPasteFromClipboard, doSelectionDrawToPrimary,
    doSelectionCrop, doSelectionDrawToSelection, doSelectionSetPosition,
    doSelectionSetSize, lastSelectionStateRef, selectionSize, selectionPosition
  } = useSelectionContext();
  const { 
    clearPrimary, primaryRef, canvasSize, lastPrimaryStateRef,
    canvasZoom
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
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
                if(data === 'selection' && selectionPhase) {
                  writeCanvasToClipboard(selectionRef.current);
                  setSelectionPhase(0);
                } else if(data === 'primary') {
                  writeCanvasToClipboard(primaryRef.current);
                  clearPrimary();
                  lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
                  doHistoryAdd({ element: doGetCanvasCopy(primaryRef.current), ...canvasSize });
                }
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={cut16} alt=""/>
              <span>Cu<span className="text--underline">t</span></span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                if(data === 'selection' && selectionPhase) {
                  writeCanvasToClipboard(selectionRef.current);
                } else if(data === 'primary') {
                  writeCanvasToClipboard(primaryRef.current);
                }
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={copy16} alt=""/>
              <span><span className="text--underline">C</span>opy</span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                if(data === 'selection' && selectionPhase) {
                  doSelectionDrawToPrimary(canvasZoom);
                }
                selectionPasteFromClipboard();
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
                if(data === 'selection' && selectionPhase) {
                  doSelectionCrop();
                }
                setIsOpen(false);
              }}
            >
              <img draggable="false" className="popup__image" src={crop16} alt=""/>
              <span>C<span className="text--underline">r</span>op</span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                if(data === 'selection' && selectionPhase) {
                  doSelectionDrawToPrimary(canvasZoom);
                }
                
                setSelectionPhase(2);
                doSelectionSetSize({ width: Math.round(canvasSize.width * canvasZoom), height: Math.round(canvasSize.height * canvasZoom) });
                doSelectionSetPosition({ x: 0, y: 0 });
                lastSelectionStateRef.current = null;
                setIsOpen(false);
                
                setTimeout(() => {
                  const primaryImageData = primaryRef.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
                  doSelectionDrawToSelection(primaryImageData);
                  clearPrimary();
                }, 20);
              }}
            >
              <img draggable="false" className="popup__image" src={selectAll16} alt=""/>
              <span>Select <span className="text--underline">a</span>ll</span>
            </button>

            <button 
              disabled={data === 'primary'}
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                if(data === 'selection' && selectionPhase) {
                  const selectionContext = selectionRef.current.getContext('2d');
                  const primaryImageData = primaryRef.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
                  let selectionImageData;
                  if(canvasZoom === 1) {
                    selectionImageData = selectionContext.getImageData(0, 0, selectionSize.width, selectionSize.height);
                  } else {
                    const copy = document.createElement('canvas');
                    const copyContext = copy.getContext('2d');
                    copy.width = Math.round(selectionSize.width / canvasZoom);
                    copy.height = Math.round(selectionSize.height / canvasZoom);
                    copyContext.imageSmoothingEnabled = false;
                    copyContext.scale(1 / canvasZoom, 1 / canvasZoom);
                    copyContext.drawImage(selectionRef.current, 0, 0);
                    selectionImageData = copyContext.getImageData(0, 0, copy.width, copy.height);
                  }
                  
                  clearPrimary();
                  doSelectionDrawToPrimary(canvasZoom);

                  const usedPosition = {
                    x: Math.max(Math.round(selectionPosition.x / canvasZoom), 0),
                    y: Math.max(Math.round(selectionPosition.y / canvasZoom), 0),
                  };
                  
                  for(
                    let y = usedPosition.y;
                    y < canvasSize.height && y < Math.round((selectionPosition.y + selectionSize.height) / canvasZoom);
                    y++
                  ) {
                    for(
                      let x = usedPosition.x;
                      x < canvasSize.width && x < Math.round((selectionPosition.x + selectionSize.width) / canvasZoom);
                      x++
                    ) {
                      if(ImageDataUtils.getColorFromCoords(selectionImageData, x - usedPosition.x, y - usedPosition.y).a > 0) {
                        ImageDataUtils.setColorAtCoords(primaryImageData, x, y, { r: 0  , g: 0, b: 0, a: 0   });
                      }
                    }
                  }

                  doSelectionSetPosition({ x: 0, y: 0 });
                  doSelectionSetSize({ width: Math.round(canvasSize.width * canvasZoom), height: Math.round(canvasSize.height * canvasZoom) });
                  setIsOpen(false);

                  setTimeout(() => {
                    doSelectionDrawToSelection(primaryImageData);
                  }, 20);
                }
              }}
            >
              <img draggable="false" className="popup__image" src={invertSelection16} alt=""/>
              <span><span className="text--underline">I</span>nvert selection</span>
            </button>

            <button 
              className="popup__button text text--4 text--nowrap"
              onClick={() => {
                if(data === 'selection' && selectionPhase) {
                  setSelectionPhase(0);
                } else if(data === 'primary') {
                  clearPrimary();
                  lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
                  doHistoryAdd({ element: doGetCanvasCopy(primaryRef.current), ...canvasSize });
                }
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
                  <button className="popup__button text text--4 text--nowrap">
                    <img draggable="false" className="popup__image" src={rotate16} alt=""/>
                    <span>Rotate <span className="text--underline">r</span>ight 90°</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img draggable="false" className="popup__image" src={rotateLeft16} alt=""/>
                    <span>Rotate <span className="text--underline">l</span>eft 90°</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img draggable="false" className="popup__image" src={rotate18016} alt=""/>
                    <span>Ro<span className="text--underline">t</span>ate 180°</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
                    <img draggable="false" className="popup__image" src={filpVertical16} alt=""/>
                    <span>Flip <span className="text--underline">v</span>ertical</span>
                  </button>

                  <button className="popup__button text text--4 text--nowrap">
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
                let usedImageData;
                const selectionContext = selectionRef.current?.getContext('2d');

                if(data === 'selection' && selectionPhase) {
                  usedImageData = selectionContext.getImageData(0, 0, selectionSize.width, selectionSize.height);
                } else if(data === 'primary') {
                  usedImageData = primaryRef.current.getContext('2d').getImageData(0, 0, canvasSize.width, canvasSize.height);
                }

                for(let y = 0; y < usedImageData.height; y++) {
                  for(let x = 0; x < usedImageData.width; x++) {
                    const color = ImageDataUtils.getColorFromCoords(usedImageData, x, y);
                    if(color.a > 0) {
                      ImageDataUtils.setColorAtCoords(usedImageData, x, y, { 
                        r: 255 - color.r, g: 255 - color.g, b: 255 - color.b, a: color.a
                      });
                    }
                  }
                }

                if(data === 'selection' && selectionPhase) {
                  selectionContext.putImageData(usedImageData, 0, 0);
                  lastSelectionStateRef.current = doGetCanvasCopy(selectionRef.current);
                } else if(data === 'primary') {
                  primaryRef.current.getContext('2d').putImageData(usedImageData, 0, 0);
                  lastPrimaryStateRef.current = doGetCanvasCopy(primaryRef.current);
                  doHistoryAdd({ element: doGetCanvasCopy(primaryRef.current), ...canvasSize });
                }

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
}

export default ContextMenu;