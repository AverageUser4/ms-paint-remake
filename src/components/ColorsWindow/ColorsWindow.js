import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './ColorsWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import ColorPicker from '../ColorPicker/ColorPicker';
import { getWindowCenteredPosition, hexToRGB, RGBtoHSL } from '../../misc/utils';
import { useMainWindowContext } from '../../misc/MainWindowContext';
import { usePaintContext } from '../../misc/PaintContext';
import { innerWindowConfig } from '../../misc/data';

import duoArrow from './assets/duo-arrow.png';

const WIDTH = 448;
const HEIGHT = 340;

const ColorsWindow = memo(function ColorsWindow({ isOpen, setIsOpen }) {
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  const { customColors, setColorPickerData } = usePaintContext();
  const basicColors = [
    '#ff8080', '#ffff80', '#80ff80', '#00ff80', '#80ffff', '#0080ff', '#ff80c0', '#ff80ff',
    '#ff0000', '#ffff00', '#80ff00', '#00ff40', '#00ffff', '#0080c0', '#8080c0', '#ff00ff',
    '#804040', '#ff8040', '#00ff00', '#008080', '#004080', '#8080ff', '#800040', '#ff0080',
    '#800000', '#ff8000', '#008000', '#008040', '#0000ff', '#0000a0', '#800080', '#8000ff',
    '#400000', '#804000', '#004000', '#004040', '#000080', '#000040', '#400040', '#400080',
    '#000000', '#808000', '#808040', '#808080', '#408080', '#c0c0c0', '#400040', '#ffffff',
  ];
  const basicButtons = basicColors.map(mapToButtons);
  const customButtons = customColors.map(mapToButtons);

  function mapToButtons(color, index) {
    return (
      <button 
        key={index}
        type="button"
        className={css['grid-button']}
        style={{ backgroundColor: color }}
        onClick={() => {
          const newRGB = hexToRGB(color);
          setColorPickerData(prev => ({ ...prev, RGB: newRGB, HSL: RGBtoHSL(newRGB) }));
        }}
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
      isInnerWindow={true}
      render={(isAttentionAnimated, onPointerDownMove) => {
        return (
          <>
            <InnerWindowTopBar
              text={'Edit Colors'}
              close={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMove={onPointerDownMove}
            />
      
            <form className={css['body']}>
              <div className={css['left']}>
                <div>
                  <h3 className="text">Basic colors:</h3>

                  <div className={css['grid']}>
                    {basicButtons}
                  </div>
                </div>

                <div>
                  <h3 className="text">Custom colors:</h3>

                  <div className={css['grid']}>
                    {customButtons}
                  </div>
                </div>

                <div>
                  <button type="button" disabled className="form-button form-button--full-width">
                    Define Custom Colors
                    <img className="form-button__icon" src={duoArrow} alt=""/>
                  </button>

                  <div className={css['buttons-container']}>
                    <button 
                      type="button"
                      className="form-button form-button--medium form-button--active"
                      onClick={() => setIsOpen(false)}
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

                <button type="button" className="form-button form-button--full-width">Add to Custom Colors</button>
                  
              </div>
            </form>
          </>
        );
      }}
    />
  );
});

ColorsWindow.propTypes = {
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default ColorsWindow;