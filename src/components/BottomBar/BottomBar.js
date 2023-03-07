import React from "react";
import PropTypes from 'prop-types';
import css from './BottomBar.module.css';

import ZoomRange from "../ZoomRange/ZoomRange";
import { useMainWindowContext } from "../../misc/MainWindowContext";
import { useCanvasContext } from "../../misc/CanvasContext";
import { useSelectionContext } from "../../misc/SelectionContext";

import canvas16 from './assets/canvas-16.ico';
import cursor16 from './assets/cursor-16.ico';
import fileSize16 from './assets/file-size-16.ico';
import selection16 from './assets/selection-16.ico';
import { ReactComponent as Cross } from '../../assets/global/cross.svg';

function BottomBar({ windowWidth }) {
  const { isMainWindowMaximized } = useMainWindowContext();
  const { canvasSize, canvasOutlineSize, canvasMousePosition, canvasZoom } = useCanvasContext();
  const { selectionPhase, selectionSize, selectionOutlineSize } = useSelectionContext();
  const usedSelectionSize = selectionOutlineSize ? selectionOutlineSize : selectionSize;
  
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
            canvasMousePosition && !canvasOutlineSize &&
              <span className="text">{Math.round(canvasMousePosition.x / canvasZoom)}, {Math.round(canvasMousePosition.y)}px</span>
          }
        </div>
        
        {
          windowWidth >= 560 &&
            <div className={css['data']}>
              <img draggable="false" src={selection16} alt="Selection size."/>
              {
                selectionPhase > 0 &&
                  <span className="text">{usedSelectionSize.width} <Cross/> {usedSelectionSize.height}px</span>
              }
            </div>
        }

        {
          windowWidth >= 720 && 
            <div className={css['data']}>
              <img draggable="false" src={canvas16} alt="Canvas size."/>
              {
                canvasOutlineSize ?
                  <span className="text">{canvasOutlineSize.width} <Cross/> {canvasOutlineSize.height}px</span>
                :
                  <span className="text">{canvasSize.width} <Cross/> {canvasSize.height}px</span>
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
};

export default BottomBar;