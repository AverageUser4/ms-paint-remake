import React, { memo, useState } from 'react';
import css from './ThumbnailWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

import { useWindowsContext } from '../../context/WindowsContext';
import { useMainWindowContext } from '../../context/MainWindowContext';
import { useCanvasContext } from '../../context/CanvasContext';
import { useColorContext } from '../../context/ColorContext';

import { innerWindowConfig } from '../../misc/data';
import { getWindowCenteredPosition, RGBObjectToString } from '../../misc/utils';

const WIDTH = 300;
const HEIGHT = 230;

const ThumbnailWindow = memo(function ThumbnailWindow() {
  const { colorData } = useColorContext();
  const { canvasSize, thumbnailPrimaryRef, thumbnailSecondaryRef } = useCanvasContext();
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const { isThumbnailWindowOpen: isOpen, setIsThumbnailWindowOpen: setIsOpen } = useWindowsContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  
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
      isInnerWindow={true}
      isResizable={true}
      isBlockingMainWindow={false}
      render={(isAttentionAnimated, onPointerDownMove) => {
        return (
          <>
            <InnerWindowTopBar
              text={'Thumbnail'}
              close={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMove={onPointerDownMove}
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
            </div>
          </>
        );
      }}
    />
  );
});

export default ThumbnailWindow;