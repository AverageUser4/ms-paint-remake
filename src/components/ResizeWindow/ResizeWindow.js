import React, { memo } from 'react';
import PropTypes from 'prop-types';
import css from './ResizeWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

import resizeHorizontal from './assets/resize-horizontal.ico';
import resizeVertical from './assets/resize-vertical.ico';
import skewHorizontal from './assets/skew-horizontal.ico';
import skewVertical from './assets/skew-vertical.ico';

const ResizeWindow = memo(function ResizeWindow({ containerDimensions }) {
  const items = [
    {
      Component: InnerWindowTopBar, 
      props: {
        text: 'Resize and Skew'
      }
    },
    {
      Component: ResizeWindowBody, 
      props: {}
    },
  ];

  return (
    <Window
      items={items}
      initialSize={{
        width: 280,
        height: 400
      }}
      initialPosition={{
        x: 40,
        y: 80
      }}
      containerDimensions={containerDimensions}
      isResizable={false}
      isInnerWindow={true}
    />
  );
});

ResizeWindow.propTypes = {
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
};

function ResizeWindowBody() {
  return (
    <form className={css['body']}>

      <div className={css['group']}>
        <h3 className={`text ${css['group-label']}`}>Resize</h3>

        <div className={css['row']}>
          <span className='text'>By:</span>

          <label>
            <input type="radio"/>
            <span className="text">Percentage</span>
          </label>
          
          <label>
            <input type="radio"/>
            <span className="text">Pixels</span>
          </label>
        </div>
        
        <div className={css['row']}>
          <img src={resizeHorizontal} alt=""/>

          <label htmlFor="rw-resize-horizontal" className={`text ${css['label']}`}>
            Horizontal:
          </label>

          <input 
            className={css['input-text']}
            id="rw-resize-horizontal"
          />
        </div>

        <div className={css['row']}>
          <img src={resizeVertical} alt=""/>

          <label htmlFor="rw-resize-vertical" className={`text ${css['label']}`}>
            Vertical:
          </label>

          <input 
            className={css['input-text']}
            id="rw-resize-vertical"
          />
        </div>


      </div>

    </form>
  );
}

export default ResizeWindow;