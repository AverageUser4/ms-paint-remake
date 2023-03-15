import React, { memo, useState, useEffect } from 'react';
import css from './PropertiesWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

import { useWindowsContext } from '../../context/WindowsContext';
import { useMainWindowContext } from '../../context/MainWindowContext';

import { innerWindowConfig, MAX_CANVAS_SIZE } from '../../misc/data';
import { getWindowCenteredPosition, doGetParsedFileSize, checkNumberValue, doGetCanvasCopy } from '../../misc/utils';
import { useCanvasContext } from '../../context/CanvasContext';
import { useHistoryContext } from '../../context/HistoryContext';

const WIDTH = 370;
const HEIGHT = 330;

const PropertiesWindow = memo(function PropertiesWindow() {
  const { 
    canvasSize, fileData, isBlackAndWhite, 
    setIsBlackAndWhite, setCanvasSize, primaryRef
  } = useCanvasContext();
  const { doHistoryAdd } = useHistoryContext();
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const { isPropertiesWindowOpen: isOpen, setIsPropertiesWindowOpen: setIsOpen } = useWindowsContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  const [isBlackAndWhiteLocal, setIsBlackAndWhiteLocal] = useState(isBlackAndWhite);
  const [sizeLocal, setSizeLocal] = useState(canvasSize);
  let parsedFileSize, parsedFileDate;
  
  useEffect(() => {
    if(isOpen) {
      setSize({ width: WIDTH, height: HEIGHT });
      setPosition(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, { width: size.width, height: size.height }));
      setIsBlackAndWhiteLocal(isBlackAndWhite)
      setSizeLocal(canvasSize);
    }
  }, [isOpen, mainWindowPosition, mainWindowSize, size.width, size.height, isBlackAndWhite, canvasSize]);

  if(fileData) {
    parsedFileSize = doGetParsedFileSize(fileData.size);
    parsedFileDate = (new Date(fileData.lastModified)).toLocaleDateString();
  }

  function onSubmit(event) {
    event.preventDefault();

    const newSize = {
      width: sizeLocal.width || 1,
      height: sizeLocal.height || 1,
    };

    if(newSize.width !== canvasSize.width || newSize.height !== canvasSize.height) {
      setCanvasSize(newSize);
      doHistoryAdd({
        element: doGetCanvasCopy(primaryRef.current),
        ...newSize,
      });
    }
    
    if(isBlackAndWhite !== isBlackAndWhiteLocal) {
      setIsBlackAndWhite(isBlackAndWhiteLocal);
    }
    
    setIsOpen(false);
  }

  function onChangeSize(event) {
    const { name, value } = event.target;

    let { numValue: numUsedValue, isInvalid } = checkNumberValue(value);
    if(isInvalid) {
      return;
    }

    if(numUsedValue > MAX_CANVAS_SIZE) {
      numUsedValue = MAX_CANVAS_SIZE;
    }

    setSizeLocal(prev => ({ ...prev, [name]: numUsedValue }));
  }
  
  return (
    <Window
      ID="PropertiesWindow"
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
              text={'Image Properties'}
              closeCallback={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMoveCallback={onPointerDownMove}
            />
      
            <form onSubmit={(e) => onSubmit(e)} className={css['body']}>

              <div>
                <div className="form-group">
                  <h3 className={`text form-group-label`}>File Attributes</h3>

                  <p className="text text--7"><span className={css['text-push']}>Last Saved:</span> {parsedFileDate ? parsedFileDate : 'Not Available'}</p>
                  <p className="text text--7"><span className={css['text-push']}>Size on disk:</span> {parsedFileSize ? parsedFileSize : 'Not Available'}</p>
                  <p className="text text--7"><span className={css['text-push']}>Resolution:</span> Not Available</p>
                </div>

                <div className={css['siblings']}>
                  <div className="form-group">
                    <h3 className={`text text--black form-group-label`}>Units</h3>

                    <label className="form-radio-label form-radio-label--spaced form-radio-label--disabled">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="properties-window-units"
                        disabled
                      />
                      <span className="text text--black">Inches</span>
                    </label>
                    
                    <label className="form-radio-label form-radio-label--spaced form-radio-label--disabled">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="properties-window-units"
                        disabled
                      />
                      <span className="text text--black">Centimeters</span>
                    </label>

                    <label className="form-radio-label form-radio-label--spaced">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="properties-window-units"
                        checked={true}
                        onChange={()=>0}
                      />
                      <span className="text text--black">Pixels</span>
                    </label>
                  </div>

                  <div className="form-group">
                    <h3 className={`text text--black form-group-label`}>Colors</h3>

                    <label className="form-radio-label form-radio-label--spaced">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="properties-window-colors"
                        checked={isBlackAndWhiteLocal}
                        onChange={() => setIsBlackAndWhiteLocal(true)}
                      />
                      <span className="text text--black">Black and white</span>
                    </label>
                    
                    <label className="form-radio-label form-radio-label--spaced">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="properties-window-colors"
                        checked={!isBlackAndWhiteLocal}
                        onChange={() => setIsBlackAndWhiteLocal(false)}
                      />
                      <span className="text text--black">Color</span>
                    </label>
                  </div>
                </div>

                <div className={css['row']}>
                  <label>
                    <span className={`text text--7 ${css['text-push']} ${css['text-push--small']}`}>Width:</span>
                    <input
                      className="form-input-text"
                      name="width"
                      value={sizeLocal.width}
                      onChange={(e) => onChangeSize(e)}
                    />
                  </label>

                  <label>
                    <span className={`text text--7 ${css['text-push']} ${css['text-push--small']}`}>Height:</span>
                    <input
                      className="form-input-text"
                      name="height"
                      value={sizeLocal.height}
                      onChange={(e) => onChangeSize(e)}
                    />
                  </label>

                  <button
                    className="form-button"  
                    type="button"
                    onClick={() => setSizeLocal({ width: 300, height: 200 })}
                  >
                    Default
                  </button>
                </div>
              </div>

              <div className={css['buttons-container']}>
                <button
                  className="form-button"  
                >
                  OK
                </button>
                <button
                  className="form-button"  
                  type="button"
                  onClick={() => setIsOpen(false)}
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

export default PropertiesWindow;