import React from "react";
import PropTypes from 'prop-types';
import css from './BottomBar.module.css';

import ZoomRange from "../ZoomRange/ZoomRange";
import { useMainWindowContext } from "../../misc/MainWindowContext";

import canvas16 from './assets/canvas-16.ico';
import cursor16 from './assets/cursor-16.ico';
import fileSize16 from './assets/file-size-16.ico';
import selection16 from './assets/selection-16.ico';
import { ReactComponent as Cross } from '../../assets/global/cross.svg';

function BottomBar({ windowWidth, canvasData }) {
  const { isMainWindowMaximized } = useMainWindowContext();
  
  return (
    <footer 
      className={`
        ${css['container']}
        ${isMainWindowMaximized ? css['container--maximized'] : ''}
      `}
    >
      
      <div className={css['left']}>
        <div className={css['data']}>
          <img draggable="false" src={cursor16} alt="Canvas position."/>
          {
            canvasData.mousePosition && !canvasData.outlineSize &&
              <span className="text">{canvasData.mousePosition.x}, {canvasData.mousePosition.y}px</span>
          }
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
              {
                canvasData.outlineSize ?
                  <span className="text">{canvasData.outlineSize.width} <Cross/> {canvasData.outlineSize.height}px</span>
                :
                  <span className="text">{canvasData.size.width} <Cross/> {canvasData.size.height}px</span>
              }
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
        <ZoomRange/>
      </div>
      
    </footer>
  );
}

BottomBar.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  canvasData: PropTypes.object.isRequired,  
}

export default BottomBar;