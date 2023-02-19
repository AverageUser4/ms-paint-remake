import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './ColorsWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import ColorPicker from '../ColorPicker/ColorPicker';
import { getWindowCenteredPosition } from '../../misc/utils';
import { useMainWindowContext } from '../../misc/MainWindowContext';

import duoArrow from './assets/duo-arrow.png';

const WIDTH = 448;
const HEIGHT = 340;

const ColorsWindow = memo(function ColorsWindow({ isOpen, setIsOpen }) {
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
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
      
            <ResizeWindowBody
              setIsOpen={setIsOpen}
            />
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

function ResizeWindowBody({ setIsOpen }) {
  const tempColors = [];
  for(let i = 0; i < 48; i++) {
    tempColors.push(
      <button key={i} type="button" className={css['grid-button']}></button>
    );
  }
  
  return (
    <form className={css['body']}>
      
      <div className={css['left']}>
        <div>
          <h3 className="text">Basic colors:</h3>

          <div className={css['grid']}>
            {tempColors}
          </div>
        </div>

        <div>
          <h3 className="text">Custom colors:</h3>

          <div className={css['grid']}>
            {tempColors.slice(0, 16)}
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
            >
              OK
            </button>
            <button 
              type="button"
              className="form-button form-button--medium"
              onClick={() => setIsOpen(false)}
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
  );
}

ResizeWindowBody.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default ColorsWindow;