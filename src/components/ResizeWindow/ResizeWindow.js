import React, { memo, useEffect, useRef, useState } from 'react';
import css from './ResizeWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import { useWindowsContext } from '../../context/WindowsContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useCanvasContext } from '../../context/CanvasContext';
import { useHistoryContext } from '../../context/HistoryContext';
import { useMainWindowContext } from '../../context/MainWindowContext';
import { useToolContext } from '../../context/ToolContext';
import { innerWindowConfig, MAX_CANVAS_SIZE } from '../../misc/data';

import resizeHorizontal from './assets/resize-horizontal.ico';
import resizeVertical from './assets/resize-vertical.ico';
import skewHorizontal from './assets/skew-horizontal.ico';
import skewVertical from './assets/skew-vertical.ico';
import { ReactComponent as Checkmark } from './assets/checkmark.svg';
import { checkNumberValue, clamp, doGetCanvasCopy, getSkewedSize, setSkew } from '../../misc/utils';

const WIDTH = 280;
const HEIGHT = 400;
const initialData = { 
  resizeHorizontal: 100,
  resizeVertical: 100,
  skewHorizontal: 0,
  skewVertical: 0,
};

const ResizeWindow = memo(function ResizeWindow() {
  const { 
    selectionPhase, selectionSize, doSelectionResize,
    doSelectionSetSize, selectionRef, doSelectionGetEveryContext
  } = useSelectionContext();
  const { canvasSize, setCanvasSize, primaryRef, doCanvasClearPrimary, doGetEveryContext } = useCanvasContext();
  const { isResizeWindowOpen: isOpen, setIsResizeWindowOpen: setIsOpen } = useWindowsContext();
  const { mainWindowPosition } = useMainWindowContext();
  const { doHistoryAdd } = useHistoryContext();
  const { currentTool } = useToolContext();

  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState({ x: mainWindowPosition.x + 40, y: mainWindowPosition.y + 80 });
  const [resizeType, setResizeType] = useState('percentage');
  const [isMaintainRatio, setIsMaintainRatio] = useState(true);
  const [data, setData] = useState(initialData);
  const lastResizeTypeRef = useRef(resizeType);
  const lastIsMaintainRatioRef = useRef(isMaintainRatio);
  const isSelectionActive = selectionPhase === 2 && !currentTool.startsWith('shape');
  const usedSize = isSelectionActive ? selectionSize : canvasSize;

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

    let { numValue: numUsedValue, isInvalid } = checkNumberValue(value);
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
  }

  function onChangeSkewInput(event) {
    const { name, value } = event.target;

    let { value: usedValue, numValue: numUsedValue, isInvalid } = checkNumberValue(value, true);
    if(isInvalid) {
      return;
    }

    numUsedValue = clamp(-89, numUsedValue, 89);
    setData(prev => ({ ...prev, [name]: usedValue === '-' ? usedValue : numUsedValue }));
  }

  function onSubmit(event) {
    event.preventDefault();
    
    const newSize = {
      width: data.resizeHorizontal || 1,
      height: data.resizeVertical || 1,
    };

    if(resizeType === 'percentage') {
      newSize.width = Math.round((usedSize.width * data.resizeHorizontal) / 100);
      newSize.height = Math.round((usedSize.height * data.resizeVertical) / 100);
    }

    const usedResize = isSelectionActive ? doSelectionResize : setCanvasSize;
    const oldCanvasSize = canvasSize;
    const primaryCopy = doGetCanvasCopy(primaryRef.current);

    if(newSize.width !== usedSize.width || newSize.height !== usedSize.height) {
      usedResize(newSize);
    }

    const usedSkewHorizontal = data.skewHorizontal === '-' ? 0 : data.skewHorizontal;
    const usedSkewVertical = data.skewVertical === '-' ? 0 : data.skewVertical;

    if(!isSelectionActive) {
      setTimeout(() => {
        const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();
        const scale = {
          x: newSize.width / oldCanvasSize.width,
          y: newSize.height / oldCanvasSize.height,
        };

        function draw(context) {
          context.save();
          context.scale(scale.x, scale.y);
          context.drawImage(primaryCopy, 0, 0);
          context.restore();
        }

        doCanvasClearPrimary();
        draw(primaryContext);
        thumbnailPrimaryContext && draw(thumbnailPrimaryContext);

        if(usedSkewHorizontal === 0 && usedSkewVertical === 0) {
          doHistoryAdd({
            element: primaryRef.current,
            ...newSize,
          });
        }
      }, 20);
    }
    
    if(usedSkewHorizontal !== 0 || usedSkewVertical !== 0) {
      setTimeout(() => {
        const usedSize = newSize;
        const usedSetSize = isSelectionActive ? doSelectionSetSize : setCanvasSize;
    
        const { width, height } = getSkewedSize(usedSize.width, usedSize.height, usedSkewHorizontal, usedSkewVertical);
        const movedX = usedSkewHorizontal < 0 ? width - usedSize.width : 0;
        const movedY = usedSkewVertical < 0 ? height - usedSize.height : 0;
    
        const { primaryContext, thumbnailPrimaryContext } = doGetEveryContext();
        const { selectionContext, thumbnailSelectionContext } = doSelectionGetEveryContext();
        const usedContext = isSelectionActive ? selectionContext : primaryContext;
        const usedCopy = doGetCanvasCopy(isSelectionActive ? selectionRef.current : primaryRef.current);
        
        const usedNewSize = {
          width: Math.min(width > 0 ? width : usedSize.width - width, MAX_CANVAS_SIZE),
          height: Math.min(height > 0 ? height : usedSize.height - height, MAX_CANVAS_SIZE),
        };
        
        usedSetSize(usedNewSize);
        
        setTimeout(() => {
          function draw(context) {
            context.save();
            context.clearRect(0, 0, usedNewSize.width, usedNewSize.height);
            context.translate(movedX, movedY);
            context.transform(1, setSkew(usedSkewVertical), setSkew(usedSkewHorizontal), 1, 0, 0);
            context.drawImage(usedCopy, 0, 0);
            context.restore();
          }

          draw(usedContext);

          if(isSelectionActive) {
            thumbnailSelectionContext && draw(thumbnailSelectionContext);
          } else {
            thumbnailPrimaryContext && draw(thumbnailPrimaryContext);
            
            doHistoryAdd({
              element: primaryRef.current,
              ...usedNewSize,
            });
          }
        }, 20);
      }, 20);
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
              closeCallback={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMoveCallback={onPointerDownMove}
            />
      
            <form className={css['body']} onSubmit={(e) => onSubmit(e)}>

              <div className="form-group">
                <h3 className={`text form-group-label`}>Resize</h3>

                <div className={css['row']}>
                  <span className='text'>By:</span>

                  <label className="form-radio-label form-radio-label--pushed">
                    <input 
                      type="radio"
                      className="form-radio"
                      name="resize-type"
                      data-cy="ResizeWindow-radio-percentage"
                      checked={resizeType === 'percentage'}
                      onChange={() => setResizeType('percentage')}
                    />
                    <span className="text">Percentage</span>
                  </label>
                  
                  <label className="form-radio-label form-radio-label--pushed">
                    <input 
                      type="radio"
                      className="form-radio"
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

              <div className="form-group">
                <h3 className={`text form-group-label`}>Skew (Degrees)</h3>

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

export default ResizeWindow;