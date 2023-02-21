import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import css from './ResizeWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import { useMainWindowContext } from '../../misc/MainWindowContext';
import { innerWindowConfig } from '../../misc/data';

import resizeHorizontal from './assets/resize-horizontal.ico';
import resizeVertical from './assets/resize-vertical.ico';
import skewHorizontal from './assets/skew-horizontal.ico';
import skewVertical from './assets/skew-vertical.ico';
import { ReactComponent as Checkmark } from './assets/checkmark.svg';

const WIDTH = 280;
const HEIGHT = 400;

const ResizeWindow = memo(function ResizeWindow({ isOpen, setIsOpen }) {
  const { mainWindowPosition } = useMainWindowContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState({ x: mainWindowPosition.x + 40, y: mainWindowPosition.y + 80 });

  useEffect(() => {
    if(isOpen) {
      setSize({ width: WIDTH, height: HEIGHT });
      setPosition({ x: mainWindowPosition.x + 40, y: mainWindowPosition.y + 80 });
    }
  }, [isOpen, mainWindowPosition]);

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
      
            <ResizeWindowBody
              setIsOpen={setIsOpen}
            />
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

function ResizeWindowBody({ setIsOpen }) {
  const [tempMaintain, setTempMaintain] = useState(true);

  return (
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
            />
            <span className="text">Percentage</span>
          </label>
          
          <label className={css['radio-label']}>
            <input 
              type="radio"
              className="form-raadio"
              name="resize-type"
              data-cy="ResizeWindow-radio-pixels"
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
          />
        </div>

        <label className={css['checkbox-label']}>
          <input 
            className={css['checkbox']} 
            type="checkbox"
            checked={tempMaintain}
            onChange={() => setTempMaintain(prev => !prev)}
            data-cy="ResizeWindow-checkbox-maintain"
          />
          {
            tempMaintain &&
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
          />
        </div>
      </div>

      <div className={css['buttons-container']}>
        <button 
          className={`form-button form-button--active`} 
          type="button"
          onClick={() => setIsOpen(false)}
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
  );
}

ResizeWindowBody.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default ResizeWindow;