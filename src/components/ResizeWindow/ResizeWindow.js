import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import css from './ResizeWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

import resizeHorizontal from './assets/resize-horizontal.ico';
import resizeVertical from './assets/resize-vertical.ico';
import skewHorizontal from './assets/skew-horizontal.ico';
import skewVertical from './assets/skew-vertical.ico';
import { ReactComponent as Checkmark } from './assets/checkmark.svg';

const ResizeWindow = memo(function ResizeWindow({ containerDimensions, setIsResizeWindowOpen, mainWindowPosition }) {
  const [position, setPosition] = useState({ x: mainWindowPosition.x + 40, y: mainWindowPosition.y + 80 });
  
  const items = [
    {
      Component: InnerWindowTopBar, 
      props: {
        text: 'Resize and Skew',
        close: () => setIsResizeWindowOpen(false)
      }
    },
    {
      Component: ResizeWindowBody, 
      props: {
        setIsResizeWindowOpen
      }
    },
  ];

  return (
    <Window
      items={items}
      initialSize={{
        width: 280,
        height: 400
      }}
      position={position}
      setPosition={setPosition}
      containerDimensions={containerDimensions}
      isResizable={false}
      isInnerWindow={true}
    />
  );
});

ResizeWindow.propTypes = {
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  setIsResizeWindowOpen: PropTypes.func.isRequired,
  mainWindowPosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
};

function ResizeWindowBody({ setIsResizeWindowOpen }) {
  const [tempMaintain, setTempMaintain] = useState(false);

  return (
    <form className={css['body']}>

      <div className={css['group']}>
        <h3 className={`text ${css['group-label']}`}>Resize</h3>

        <div className={css['row']}>
          <span className='text'>By:</span>

          <label className={css['radio-label']}>
            <input 
              type="radio"
              className={css['radio']}
              name="resize-type"
            />
            <span className="text">Percentage</span>
          </label>
          
          <label className={css['radio-label']}>
            <input 
              type="radio"
              className={css['radio']}
              name="resize-type"
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
            className={css['input-text']}
            id="rw-resize-horizontal"
          />
        </div>

        <div className={css['row']}>
          <img src={resizeVertical} alt=""/>

          <label htmlFor="rw-resize-vertical" className={`text ${css['text-label']}`}>
            Vertical:
          </label>

          <input 
            className={css['input-text']}
            id="rw-resize-vertical"
          />
        </div>

        <label className={css['checkbox-label']}>
          <input 
            className={css['checkbox']} 
            type="checkbox"
            checked={tempMaintain}
            onChange={() => setTempMaintain(prev => !prev)}
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
            className={css['input-text']}
            id="rw-skew-horizontal"
          />
        </div>

        <div className={css['row']}>
          <img src={skewVertical} alt=""/>

          <label htmlFor="rw-skew-vertical" className={`text ${css['text-label']}`}>
            Vertical:
          </label>

          <input 
            className={css['input-text']}
            id="rw-skew-vertical"
          />
        </div>
      </div>

      <div className={css['buttons-container']}>
        <button 
          className={`${css['button']} ${css['button--active']}`} 
          type="button"
          onClick={() => setIsResizeWindowOpen(false)}
        >
          OK
        </button>
        <button 
          className={`${css['button']}`} 
          type="button"
          onClick={() => setIsResizeWindowOpen(false)}
        >
          Cancel
        </button>
      </div>

    </form>
  );
}

ResizeWindowBody.propTypes = {
  setIsResizeWindowOpen: PropTypes.func.isRequired,
};

export default ResizeWindow;