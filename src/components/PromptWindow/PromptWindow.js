import React, { memo, useState, useEffect } from 'react';
import css from './PromptWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import { getWindowCenteredPosition } from '../../misc/utils';
import { useWindowsContext } from '../../misc/WindowsContext';
import { innerWindowConfig } from '../../misc/data';

const WIDTH = 350;
const HEIGHT = 135;

const PromptWindow = memo(function PromptWindow() {
  const { 
    mainWindowPosition, mainWindowSize,
    isPromptWindowOpen: isOpen, setIsPromptWindowOpen: setIsOpen
  } = useWindowsContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  
  useEffect(() => {
    if(isOpen) {
      setSize({ width: WIDTH, height: HEIGHT });
      setPosition(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, { width: size.width, height: size.height }));
    }
  }, [isOpen, mainWindowPosition, mainWindowSize, size.width, size.height]);

  return (
    <Window
      ID="PromptWindow"
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
              text={'Paint'}
              close={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMove={onPointerDownMove}
            />
      
            <div className={css['body']}>
              <div className={css['top']}>
                <h3 className="text text--5">Do you want to save changes to Untitled?</h3>
              </div>

              <div className={css['buttons-container']}>
                <button 
                  type="button"
                  className="form-button form-button--active"
                  onClick={() => setIsOpen(false)}
                >
                  Save
                </button>
                <button 
                  type="button"
                  className="form-button"
                  onClick={() => setIsOpen(false)}
                >
                  Don&apos;t Save
                </button>
                <button 
                  type="button"
                  className="form-button"
                  onClick={() => setIsOpen(false)}
                  data-cy="PromptWindow-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        );
      }}
    />
  );
});

export default PromptWindow;