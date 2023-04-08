import React, { memo } from "react";
import PropTypes from 'prop-types';
import css from './StatusBar.module.css';

import ZoomRange from "../ZoomRange/ZoomRange";
import { useWindowsContext } from "../../context/WindowsContext";
import { useCanvasContext } from "../../context/CanvasContext";
import { useSelectionContext } from "../../context/SelectionContext";
import { useCanvasMiscContext } from "../../context/CanvasMiscContext";
import { doGetParsedFileSize } from "../../misc/utils";

import canvas16 from './assets/canvas-16.ico';
import cursor16 from './assets/cursor-16.ico';
import fileSize16 from './assets/file-size-16.ico';
import selection16 from './assets/selection-16.ico';
import { ReactComponent as Cross } from '../../assets/global/cross.svg';

const StatusBar = memo(function StatusBar({ windowWidth, isMainWindowMaximized }) {
  const { isStatusBarVisible } = useWindowsContext();
  const { canvasSize, canvasZoom, fileData } = useCanvasContext();
  const { canvasOutlineSize, canvasMousePosition } = useCanvasMiscContext();
  const { selectionPhase, selectionSize, selectionOutlineSize } = useSelectionContext();
  let usedSelectionSize = selectionSize;
  if(selectionOutlineSize) {
    usedSelectionSize = {
      width: Math.round(selectionOutlineSize.width / canvasZoom),
      height: Math.round(selectionOutlineSize.height / canvasZoom),
    };
  }
  
  let parsedFileSize;

  if(!isStatusBarVisible) {
    return null;
  }

  if(fileData) {
    parsedFileSize = doGetParsedFileSize(fileData.size);
  }

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
              <span className="text">{Math.round(canvasMousePosition.x / canvasZoom)}, {Math.round(canvasMousePosition.y / canvasZoom)}px</span>
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
                  <span className="text">{Math.round(canvasOutlineSize.width / canvasZoom)} <Cross/> {Math.round(canvasOutlineSize.height / canvasZoom)}px</span>
                :
                  <span className="text">{canvasSize.width} <Cross/> {canvasSize.height}px</span>
              }
            </div>
        }

        {
          windowWidth >= 880 &&
          <div className={css['data']}>
            <img draggable="false" src={fileSize16} alt="File size."/>
            {parsedFileSize && <span className="text">Size: {parsedFileSize}</span>}
          </div>
        }
      </div>

      <div className={css['right']}>
        <ZoomRange/>
      </div>
      
    </footer>
  );
});

StatusBar.propTypes = {
  windowWidth: PropTypes.number.isRequired,
  isMainWindowMaximized: PropTypes.bool.isRequired,
};

export default StatusBar;