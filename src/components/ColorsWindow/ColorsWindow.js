import React, { memo, useState, useEffect } from 'react';
import css from './ColorsWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import ColorPicker from '../ColorPicker/ColorPicker';

import { useWindowsContext } from '../../context/WindowsContext';
import { useColorContext } from '../../context/ColorContext';
import { useMainWindowContext } from '../../context/MainWindowContext';

import { getWindowCenteredPosition, RGBtoHSL, RGBObjectToString } from '../../misc/utils';
import { innerWindowConfig } from '../../misc/data';

import duoArrow from './assets/duo-arrow.png';

const WIDTH = 448;
const HEIGHT = 340;
const basicColorsArray = [
  { r: 255, g: 128, b: 128 }, { r: 255, g: 255, b: 128 }, { r: 128, g: 255, b: 128 }, { r: 0, g: 255, b: 128 }, { r: 128, g: 255, b: 255 }, { r: 0, g: 128, b: 255 }, { r: 255, g: 128, b: 192 }, { r: 255, g: 128, b: 255 },
  { r: 255, g: 0, b: 0 }, { r: 255, g: 255, b: 0 }, { r: 128, g: 255, b: 0 }, { r: 0, g: 255, b: 64 }, { r: 0, g: 255, b: 255 }, { r: 0, g: 128, b: 192 }, { r: 128, g: 128, b: 192 }, { r: 255, g: 0, b: 255 },
  { r: 128, g: 64, b: 64 }, { r: 255, g: 128, b: 64 }, { r: 0, g: 255, b: 0 }, { r: 0, g: 128, b: 128 }, { r: 0, g: 64, b: 128 }, { r: 128, g: 128, b: 255 }, { r: 128, g: 0, b: 64 }, { r: 255, g: 0, b: 128 },
  { r: 128, g: 0, b: 0 }, { r: 255, g: 128, b: 0 }, { r: 0, g: 128, b: 0 }, { r: 0, g: 128, b: 64 }, { r: 0, g: 0, b: 255 }, { r: 0, g: 0, b: 160 }, { r: 128, g: 0, b: 128 }, { r: 128, g: 0, b: 255 },
  { r: 64, g: 0, b: 0 }, { r: 128, g: 64, b: 0 }, { r: 0, g: 64, b: 0 }, { r: 0, g: 64, b: 64 }, { r: 0, g: 0, b: 128 }, { r: 0, g: 0, b: 64 }, { r: 64, g: 0, b: 64 }, { r: 64, g: 0, b: 128 },
  { r: 0, g: 0, b: 0 }, { r: 128, g: 128, b: 0 }, { r: 128, g: 128, b: 64 }, { r: 128, g: 128, b: 128 }, { r: 64, g: 128, b: 128 }, { r: 192, g: 192, b: 192 }, { r: 64, g: 0, b: 64 }, { r: 255, g: 255, b: 255 },
];

const ColorsWindow = memo(function ColorsWindow() {
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const { isColorsWindowOpen: isOpen, setIsColorsWindowOpen: setIsOpen } = useWindowsContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  const { customColorsArray, setColorPickerData, colorPickerData, doCustomColorsArrayAdd, doRibbonColorsArrayAdd } = useColorContext();
  const basicButtonsArray = basicColorsArray.map(mapToButtons);
  const customButtonsArray = customColorsArray.map(mapToButtons);

  function mapToButtons(color, index) {
    return (
      <button 
        key={index}
        type="button"
        className={css['grid-button']}
        style={{ backgroundColor: RGBObjectToString(color) }}
        onClick={() => setColorPickerData(prev =>  ({ ...prev, RGB: color, HSL: RGBtoHSL(color) }))}
      ></button>
    );
  }
  
  useEffect(() => {
    if(isOpen) {
      setSize({ width: WIDTH, height: HEIGHT });
      setPosition(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, { width: size.width, height: size.height }));
    }
  }, [isOpen, mainWindowPosition, mainWindowSize, size.width, size.height]);

  return (
    <Window
      ID="ColorsWindow"
      {...innerWindowConfig}
      isOpen={isOpen}
      size={size}
      setSize={setSize}
      position={position}
      setPosition={setPosition}
      render={(isAttentionAnimated, onPointerDownMove) => {
        return (
          <>
            <InnerWindowTopBar
              text={'Edit Colors'}
              closeCallback={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMoveCallback={onPointerDownMove}
            />
      
            <form className={css['body']}>
              <div className={css['left']}>
                <div>
                  <h3 className="text">Basic colors:</h3>

                  <div className={css['grid']}>
                    {basicButtonsArray}
                  </div>
                </div>

                <div>
                  <h3 className="text">Custom colors:</h3>

                  <div className={`${css['grid']} ${css['grid--alt']}`}>
                    {customButtonsArray}
                  </div>
                </div>

                <div>
                  <button 
                    type="button"
                    className="form-button form-button--full-width form-button--disabled"
                    tabIndex={-1}
                  >
                    Define Custom Colors
                    <img className="form-button__icon" src={duoArrow} alt=""/>
                  </button>

                  <div className={css['buttons-container']}>
                    <button 
                      type="button"
                      className="form-button form-button--medium form-button--active"
                      onClick={() => { 
                        setIsOpen(false);
                        doRibbonColorsArrayAdd(colorPickerData.RGB);
                      }}
                      data-cy="ColorsWindow-confirm"
                    >
                      OK
                    </button>
                    <button 
                      type="button"
                      className="form-button form-button--medium"
                      onClick={() => setIsOpen(false)}
                      data-cy="ColorsWindow-cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div className={css['right']}>

                <ColorPicker/>

                <button 
                  type="button"
                  className="form-button form-button--full-width"
                  onClick={() => doCustomColorsArrayAdd(colorPickerData.RGB)}
                >
                  Add to Custom Colors
                </button>
                  
              </div>
            </form>
          </>
        );
      }}
    />
  );
});

export default ColorsWindow;