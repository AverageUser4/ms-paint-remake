import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import css from './ColorsWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import ColorPicker from '../ColorPicker/ColorPicker';
import { getWindowCenteredPosition } from '../../misc/utils';

import duoArrow from './assets/duo-arrow.png';

const WIDTH = 448;
const HEIGHT = 340;

const ColorsWindow = memo(function ColorsWindow({ containerDimensions, setIsColorsWindowOpen, mainWindowPosition, mainWindowSize }) {
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  
  const items = [
    {
      Component: InnerWindowTopBar, 
      props: {
        text: 'Edit Colors',
        close: () => setIsColorsWindowOpen(false)
      }
    },
    {
      Component: ResizeWindowBody, 
      props: {
        setIsColorsWindowOpen
      }
    },
  ];

  return (
    <Window
      items={items}
      size={size}
      setSize={setSize}
      position={position}
      setPosition={setPosition}
      containerDimensions={containerDimensions}
      isResizable={false}
      isInnerWindow={true}
    />
  );
});

ColorsWindow.propTypes = {
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  setIsColorsWindowOpen: PropTypes.func.isRequired,
  mainWindowPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  mainWindowSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,
};

function ResizeWindowBody({ setIsColorsWindowOpen }) {
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
              onClick={() => setIsColorsWindowOpen(false)}
            >
              OK
            </button>
            <button 
              type="button"
              className="form-button form-button--medium"
              onClick={() => setIsColorsWindowOpen(false)}
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
  setIsColorsWindowOpen: PropTypes.func.isRequired,
};

export default ColorsWindow;