import React, { memo, useState, useEffect } from 'react';
import css from './PropertiesWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

import { useWindowsContext } from '../../context/WindowsContext';
import { useMainWindowContext } from '../../context/MainWindowContext';

import { innerWindowConfig } from '../../misc/data';
import { getWindowCenteredPosition } from '../../misc/utils';

const WIDTH = 370;
const HEIGHT = 340;

const PropertiesWindow = memo(function PropertiesWindow() {
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const { isPropertiesWindowOpen: isOpen, setIsPropertiesWindowOpen: setIsOpen } = useWindowsContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  
  useEffect(() => {
    if(isOpen) {
      setSize({ width: WIDTH, height: HEIGHT });
      setPosition(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, { width: size.width, height: size.height }));
    }
  }, [isOpen, mainWindowPosition, mainWindowSize, size.width, size.height]);

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
              close={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMove={onPointerDownMove}
            />
      
            <form className={css['body']}>

              <div>
                <div className="form-group">
                  <h3 className={`text form-group-label`}>File Attributes</h3>

                  <p className="text text--7"><span className={css['text-push']}>Last Saved:</span> Not Available</p>
                  <p className="text text--7"><span className={css['text-push']}>Size on disk:</span> Not Available</p>
                  <p className="text text--7"><span className={css['text-push']}>Resolution:</span> 96 DPI</p>
                </div>

                <div className={css['siblings']}>
                  <div className="form-group">
                    <h3 className={`text text--black form-group-label`}>Units</h3>

                    <label className="form-radio-label form-radio-label--spaced">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="units"
                      />
                      <span className="text text--black">Inches</span>
                    </label>
                    
                    <label className="form-radio-label form-radio-label--spaced">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="units"
                      />
                      <span className="text text--black">Centimeters</span>
                    </label>

                    <label className="form-radio-label form-radio-label--spaced">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="units"
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
                        name="colors"
                      />
                      <span className="text text--black">Black and white</span>
                    </label>
                    
                    <label className="form-radio-label form-radio-label--spaced">
                      <input 
                        type="radio"
                        className="form-radio"
                        name="colors"
                      />
                      <span className="text text--black">Color</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label>
                    Width:
                    <input/>
                  </label>

                  <label>
                    Height:
                    <input/>
                  </label>

                  <button>Default</button>
                </div>
              </div>

              <div className={css['buttons-container']}>
                <button>OK</button>
                <button>Cancel</button>
              </div>

            </form>
          </>
        );
      }}
    />
  );
});

export default PropertiesWindow;