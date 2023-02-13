import React, { useState } from "react";
import PropTypes from 'prop-types';
import css from './BottomBar.module.css';

import canvas16 from './assets/canvas-16.ico';
import cursor16 from './assets/cursor-16.ico';
import fileSize16 from './assets/file-size-16.ico';
import selection16 from './assets/selection-16.ico';
import { ReactComponent as Cross } from '../../assets/global/cross.svg';

const zoomData = [
  { percent: 12.5, offset: 7 },
  { percent: 25, offset: 12 },
  { percent: 50, offset: 23 },
  { percent: 100, offset: 45 },
  { percent: 200, offset: 51 },
  { percent: 300, offset: 57 },
  { percent: 400, offset: 63 },
  { percent: 500, offset: 68 },
  { percent: 600, offset: 73 },
  { percent: 700, offset: 78 },
  { percent: 800, offset: 83 },
];

function BottomBar({ windowWidth }) {
  const [zoomPercent, setZoomPercent] = useState(100);

  function getOffsetForPercent(percent) {
    return zoomData.find(data => data.percent === percent).offset;
  }
  
  function changeZoom(decrease) {
    const currentIndex = zoomData.findIndex(data => data.percent === zoomPercent); 
    const newIndex = currentIndex + (decrease ? -1 : 1);

    if(newIndex < 0 || newIndex > zoomData.length)
      return;

    setZoomPercent(zoomData[newIndex].percent);
  }
  
  return (
    <footer className={css['container']}>
      
      <div className={css['left']}>
        <div className={css['data']}>
          <img draggable="false" src={cursor16} alt="Canvas position."/>
          <span className="text">100, 100px</span>
        </div>
        
        {
          windowWidth >= 560 &&
            <div className={css['data']}>
              <img draggable="false" src={selection16} alt="Selection size."/>
              <span className="text">100 <Cross/> 100px</span>
            </div>
        }

        {
          windowWidth >= 720 && 
            <div className={css['data']}>
              <img draggable="false" src={canvas16} alt="Canvas size."/>
              <span className="text">100 <Cross/> 100px</span>
            </div>
        }

        {
          windowWidth >= 880 &&
          <div className={css['data']}>
            <img draggable="false" src={fileSize16} alt="File size."/>
            <span className="text">Size: 4.8KB</span>
          </div>
        }
      </div>

      <div className={css['right']}>

        <span style={{ width: 35 }} className="text">{zoomPercent}%</span>

        <button className={css['minus']} onClick={() => changeZoom(true)}></button>

        <div tabIndex="0" className={css['range']}>
          <div style={{ left: getOffsetForPercent(zoomPercent) }} className={css['range-control']}></div>
        </div>

        <button className={css['plus']} onClick={() => changeZoom(false)}></button>
        
      </div>
      
    </footer>
  );
}

BottomBar.propTypes = {
  windowWidth: PropTypes.number.isRequired
}

export default BottomBar;