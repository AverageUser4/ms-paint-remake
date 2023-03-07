import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './ResizeWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import { useMainWindowContext } from '../../misc/MainWindowContext';
import { useSelectionContext } from '../../misc/SelectionContext';
import { useCanvasContext } from '../../misc/CanvasContext';
import { innerWindowConfig, MAX_CANVAS_SIZE } from '../../misc/data';

import resizeHorizontal from './assets/resize-horizontal.ico';
import resizeVertical from './assets/resize-vertical.ico';
import skewHorizontal from './assets/skew-horizontal.ico';
import skewVertical from './assets/skew-vertical.ico';
import { ReactComponent as Checkmark } from './assets/checkmark.svg';
import { checkNumberValue, doGetCanvasCopy, getSkewedSize, setSkew } from '../../misc/utils';

const WIDTH = 280;
const HEIGHT = 400;
const initialData = { 
  resizeHorizontal: 100,
  resizeVertical: 100,
  skewHorizontal: 0,
  skewVertical: 0,
};

const ResizeWindow = memo(function ResizeWindow({ isOpen, setIsOpen }) {
  const { selectionPhase, selectionSize, doSelectionResize, selectionRef } = useSelectionContext();
  const { canvasSize, setCanvasSize } = useCanvasContext();
  const { mainWindowPosition } = useMainWindowContext();

  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState({ x: mainWindowPosition.x + 40, y: mainWindowPosition.y + 80 });
  const [resizeType, setResizeType] = useState('percentage');
  const [isMaintainRatio, setIsMaintainRatio] = useState(true);
  const [data, setData] = useState(initialData);
  const lastResizeTypeRef = useRef(resizeType);
  const lastIsMaintainRatioRef = useRef(isMaintainRatio);
  const usedSize = selectionPhase === 2 ? selectionSize : canvasSize;

  useEffect(() => {
    if(isOpen) {
      setSize({ width: WIDTH, height: HEIGHT });
      setPosition({ x: mainWindowPosition.x + 40, y: mainWindowPosition.y + 80 });
    }
  }, [isOpen, mainWindowPosition]);

  useEffect(() => {
    if(isOpen) {
      setResizeType('percentage');
      lastResizeTypeRef.current = 'percentage';
      setIsMaintainRatio(true);
      lastIsMaintainRatioRef.current = true;
      setData(initialData);
    }
  }, [isOpen]);

  useEffect(() => {
    if(
        resizeType === lastResizeTypeRef.current &&
        isMaintainRatio === lastIsMaintainRatioRef.current
      ) {
      return;
    }

    lastResizeTypeRef.current = resizeType;
    lastIsMaintainRatioRef.current = isMaintainRatio;

    if(resizeType === lastResizeTypeRef.current && isMaintainRatio === false) {
      return;
    }
    
    if(resizeType === 'percentage') {
      setData(prev => ({ ...prev, resizeHorizontal: 100, resizeVertical: 100 }));
    } else if(resizeType === 'pixels') {
      setData(prev => ({ ...prev, resizeHorizontal: usedSize.width, resizeVertical: usedSize.height }));
    }
  }, [resizeType, usedSize, isMaintainRatio]);

  function onChangeResizeInput(event) {
    const { name, value } = event.target;

    let [numUsedValue, isInvalid] = checkNumberValue(value);
    if(isInvalid) {
      return;
    }

    if(resizeType === 'percentage') {
      const maxHorizontalPercentage = Math.round(MAX_CANVAS_SIZE / usedSize.width * 100);
      const maxVerticalPercentage = Math.round(MAX_CANVAS_SIZE / usedSize.height * 100);
      const maxSharedPercentage = Math.min(maxHorizontalPercentage, maxVerticalPercentage);

      if(isMaintainRatio) {
        numUsedValue = Math.min(maxSharedPercentage, numUsedValue);
        setData(prev => ({ 
          ...prev, 
          resizeHorizontal: numUsedValue,
          resizeVertical: numUsedValue,
        }));
      } else {
        numUsedValue = Math.min(name === 'resizeHorizontal' ? maxHorizontalPercentage : maxVerticalPercentage, numUsedValue);
        setData(prev => ({ ...prev, [name]: numUsedValue }));
      }
    } else if(resizeType === 'pixels') {
      numUsedValue = Math.min(MAX_CANVAS_SIZE, numUsedValue);

      if(isMaintainRatio) {
        const horizontalMultiplier = usedSize.width / usedSize.height;
        const verticalMultiplier = usedSize.height / usedSize.width;

        let usedHorizontal;
        let usedVertical;

        if(name === 'resizeHorizontal') {
          usedHorizontal = numUsedValue;
          usedVertical = Math.round(numUsedValue * verticalMultiplier);

          if(usedVertical > MAX_CANVAS_SIZE) {
            usedVertical = MAX_CANVAS_SIZE;
            usedHorizontal = Math.round(MAX_CANVAS_SIZE * horizontalMultiplier);
          }
        } else if(name === 'resizeVertical') {
          usedVertical = numUsedValue;
          usedHorizontal = Math.round(numUsedValue * horizontalMultiplier);

          if(usedHorizontal > MAX_CANVAS_SIZE) {
            usedHorizontal = MAX_CANVAS_SIZE;
            usedVertical = Math.round(MAX_CANVAS_SIZE * verticalMultiplier);
          }
        }

        setData(prev => ({ ...prev, resizeHorizontal: usedHorizontal, resizeVertical: usedVertical }));
      } else {
        setData(prev => ({ ...prev, [name]: numUsedValue }));
      }
    }
    
    // skew 0-180
    // percent 1-(based on how big would be)
    // pixels 1-MAX_CANVAS_SIZE
  }

  function onChangeSkewInput(event) {
    const { name, value } = event.target;

    let [numUsedValue, isInvalid] = checkNumberValue(value);
    if(isInvalid) {
      return;
    }

    numUsedValue = Math.min(numUsedValue, 179);
    setData(prev => ({ ...prev, [name]: numUsedValue }));
  }

  function doApplyChanges() {
    const newSize = {
      width: data.resizeHorizontal,
      height: data.resizeVertical,
    }

    if(resizeType === 'percentage') {
      newSize.width = Math.round((usedSize.width * data.resizeHorizontal) / 100);
      newSize.height = Math.round((usedSize.height * data.resizeVertical) / 100);
    }

    if(selectionPhase === 2) {
      doSelectionResize(newSize);

      if(data.skewHorizontal !== 0 || data.skewVertical !== 0) {
        setTimeout(() => {
          const usedSize = newSize;
          const usedSetSize = selectionPhase === 2 ? doSelectionResize : setCanvasSize;
      
          const myDegreeX = data.skewHorizontal;
          const myDegreeY = data.skewVertical;
          const myWidth = usedSize.width;
          const myHeight = usedSize.height;
      
          const { width, height } = getSkewedSize(myWidth, myHeight, myDegreeX, myDegreeY);
          const movedX = myDegreeX < 0 ? width - myWidth : 0;
          const movedY = myDegreeY < 0 ? height - myHeight : 0;
      
          console.log(newSize, width, height)
          
          const selectionContext = selectionRef.current.getContext('2d');
          const selectionCopy = doGetCanvasCopy(selectionRef.current);
          
          usedSetSize({
            width: width > 0 ? width : usedSize.width - width,
            height: height > 0 ? height : usedSize.height - height,
          });
          
          setTimeout(() => {
            selectionContext.clearRect(0, 0, MAX_CANVAS_SIZE, MAX_CANVAS_SIZE);
            selectionContext.translate(movedX, movedY);
            selectionContext.transform(1, setSkew(myDegreeY), setSkew(myDegreeX), 1, 0, 0);
            selectionContext.drawImage(selectionCopy, 0, 0);
          }, 20);
        }, 20);
      }
    } else {
      setCanvasSize(newSize);
    }
  
    setIsOpen(false);
  }

  return (
    <Window
      ID="ResizeWindow"
      {...innerWindowConfig}
      isOpen={isOpen}
      size={size}
      setSize={setSize}
      position={position}
      setPosition={setPosition}
      isInnerWindow={true}
      render={(isAttentionAnimated, onPointerDownMove) => {
        return (
          <>
            <InnerWindowTopBar
              text={'Resize and Skew'}
              close={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMove={onPointerDownMove}
            />
      
            <form className={css['body']}>

              <div className={css['group']}>
                <h3 className={`text ${css['group-label']}`}>Resize</h3>

                <div className={css['row']}>
                  <span className='text'>By:</span>

                  <label className={css['radio-label']}>
                    <input 
                      type="radio"
                      className="form-raadio"
                      name="resize-type"
                      data-cy="ResizeWindow-radio-percentage"
                      checked={resizeType === 'percentage'}
                      onChange={() => setResizeType('percentage')}
                    />
                    <span className="text">Percentage</span>
                  </label>
                  
                  <label className={css['radio-label']}>
                    <input 
                      type="radio"
                      className="form-raadio"
                      name="resize-type"
                      data-cy="ResizeWindow-radio-pixels"
                      checked={resizeType === 'pixels'}
                      onChange={() => setResizeType('pixels')}
                    />
                    <span className="text">Pixels</span>
                  </label>
                </div>
                
                <div className={css['row']}>
                  <img src={resizeHorizontal} alt=""/>

                  <label htmlFor="rw-resize-horizontal" className={`text ${css['text-label']}`}>
                    Horizontal:
                  </label>

                  <input 
                    className="form-input-text"
                    id="rw-resize-horizontal"
                    data-cy="ResizeWindow-input-resize-horizontal"
                    name="resizeHorizontal"
                    value={data.resizeHorizontal}
                    onChange={(e) => onChangeResizeInput(e)}
                  />
                </div>

                <div className={css['row']}>
                  <img src={resizeVertical} alt=""/>

                  <label htmlFor="rw-resize-vertical" className={`text ${css['text-label']}`}>
                    Vertical:
                  </label>

                  <input 
                    className="form-input-text"
                    id="rw-resize-vertical"
                    data-cy="ResizeWindow-input-resize-vertical"
                    name="resizeVertical"
                    value={data.resizeVertical}
                    onChange={(e) => onChangeResizeInput(e)}
                  />
                </div>

                <label className={css['checkbox-label']}>
                  <input 
                    className={css['checkbox']} 
                    type="checkbox"
                    checked={isMaintainRatio}
                    onChange={() => setIsMaintainRatio(prev => !prev)}
                    data-cy="ResizeWindow-checkbox-maintain"
                  />
                  {
                    isMaintainRatio &&
                      <Checkmark className={css['checkmark']}/>
                  }
                  <span className="text">Maintain aspect ratio</span>
                </label>
              </div>

              <div className={css['group']}>
                <h3 className={`text ${css['group-label']}`}>Skew (Degrees)</h3>

                <div className={css['row']}>
                  <img src={skewHorizontal} alt=""/>

                  <label htmlFor="rw-skew-horizontal" className={`text ${css['text-label']}`}>
                    Horizontal:
                  </label>

                  <input 
                    className="form-input-text"
                    id="rw-skew-horizontal"
                    data-cy="ResizeWindow-input-skew-horizontal"
                    name="skewHorizontal"
                    value={data.skewHorizontal}
                    onChange={(e) => onChangeSkewInput(e)}
                  />
                </div>

                <div className={css['row']}>
                  <img src={skewVertical} alt=""/>

                  <label htmlFor="rw-skew-vertical" className={`text ${css['text-label']}`}>
                    Vertical:
                  </label>

                  <input 
                    className="form-input-text"
                    id="rw-skew-vertical"
                    data-cy="ResizeWindow-input-skew-vertical"
                    name="skewVertical"
                    value={data.skewVertical}
                    onChange={(e) => onChangeSkewInput(e)}
                  />
                </div>
              </div>

              <div className={css['buttons-container']}>
                <button 
                  className={`form-button form-button--active`} 
                  type="button"
                  onClick={() => doApplyChanges()}
                  data-cy="ResizeWindow-confirm"
                >
                  OK
                </button>
                <button 
                  className={`form-button`} 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  data-cy="ResizeWindow-cancel"
                >
                  Cancel
                </button>
              </div>

            </form>
          </>
        );
      }}
    />
  );
});

ResizeWindow.propTypes = {
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default ResizeWindow;