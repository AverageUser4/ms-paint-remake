import React, { memo, useState, useEffect } from 'react';
import css from './ThumbnailWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

import { useWindowsContext } from '../../context/WindowsContext';
import { useMainWindowContext } from '../../context/MainWindowContext';
import { useCanvasContext } from '../../context/CanvasContext';
import { useColorContext } from '../../context/ColorContext';
import { useSelectionContext } from '../../context/SelectionContext';

import { innerWindowConfig } from '../../misc/data';
import { getWindowCenteredPosition, RGBObjectToString } from '../../misc/utils';

const WIDTH = 300;
const HEIGHT = 230;

const ThumbnailWindow = memo(function ThumbnailWindow() {
  const { colorData } = useColorContext();
  const { canvasSize, thumbnailPrimaryRef, thumbnailSecondaryRef, primaryRef } = useCanvasContext();
  const { thumbnailSelectionRef, selectionSize, selectionPosition, selectionPhase, selectionRef } = useSelectionContext();
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const { isThumbnailWindowOpen: isOpen, setIsThumbnailWindowOpen: setIsOpen } = useWindowsContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  
  useEffect(() => {
    if(isOpen) {
      thumbnailPrimaryRef.current.getContext('2d').drawImage(primaryRef.current, 0, 0);
      if(selectionPhase === 2) {
        thumbnailSelectionRef.current.getContext('2d').drawImage(selectionRef.current, 0, 0);
      }
    }
  }, [isOpen, thumbnailPrimaryRef, primaryRef, selectionPhase, thumbnailSelectionRef, selectionRef]);

  return (
    <Window
      {...innerWindowConfig}
      ID="ThumbnailWindow"
      size={size}
      setSize={setSize}
      position={position}
      setPosition={setPosition}
      minimalSize={{ width: 120, height: 100 }}
      isOpen={isOpen}
      isResizable={true}
      isBlockingMainWindow={false}
      render={(isAttentionAnimated, onPointerDownMove) => {
        return (
          <>
            <InnerWindowTopBar
              text={'Thumbnail'}
              closeCallback={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMoveCallback={onPointerDownMove}
            />
      
            <div className={css['body']}>
              <canvas
                className={css['canvas']}
                ref={thumbnailPrimaryRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{ backgroundColor: RGBObjectToString(colorData.secondary) }}
              />
              <canvas
                className={css['canvas']}
                ref={thumbnailSecondaryRef}
                width={canvasSize.width}
                height={canvasSize.height}
              />
              {
                selectionPhase &&
                  <canvas
                    className={`${css['canvas']} ${css['canvas--selection']}`}
                    ref={thumbnailSelectionRef}
                    width={selectionSize.width}
                    height={selectionSize.height}
                    style={{
                      top: selectionPosition.y,
                      left: selectionPosition.x,
                    }}
                  />
              }
            </div>
          </>
        );
      }}
    />
  );
});

export default ThumbnailWindow;