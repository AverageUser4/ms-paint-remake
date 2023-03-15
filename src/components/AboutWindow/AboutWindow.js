import React, { memo, useState, useEffect } from 'react';
import css from './AboutWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';

import { useWindowsContext } from '../../context/WindowsContext';
import { useMainWindowContext } from '../../context/MainWindowContext';

import { innerWindowConfig } from '../../misc/data';
import { getWindowCenteredPosition } from '../../misc/utils';

import windowsLogo from './assets/windows-logo.png';
import paintLogo from './assets/paint-logo.ico';

const WIDTH = 450;
const HEIGHT = 422;

const AboutWindow = memo(function AboutWindow() {
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const { isAboutWindowOpen: isOpen, setIsAboutWindowOpen: setIsOpen } = useWindowsContext();
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
      ID="AboutWindow"
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
              text={'About Paint'}
              closeCallback={() => setIsOpen(false)}
              isAttentionAnimated={isAttentionAnimated}
              onPointerDownMoveCallback={onPointerDownMove}
            />
      
            <div className={css['body']}>
              <div className={css['top']}>
                <img className={css['image']} draggable="false" src={windowsLogo} alt=""/>
              </div>

              <div className={css['middle']}>
                <img className={css['image']} draggable="false" src={paintLogo} alt=""/>

                <div>
                  <p className="text text--7">Microsoft Windows</p>
                  <p className="text text--7">Version 22H2 (OS Build 19045.2604)</p>
                  <p className="text text--7">&copy;Microsoft Corporation. All rights reserved.</p>

                  <div className={css['gap']}/>
                  <p className="text text--7">The Windows 10 Pro operating system and its user interface are protected by trademark and other pending or existing intellectual property rights in the United States and other countries/regions.</p>
                  <div className={`${css['gap']} ${css['gap--big']}`}/>

                  <p className="text text--7">This product is licensed under the <a target="_blank" rel="noreferrer" draggable="false" className="link" href="https://www.microsoft.com/en-us/useterms/">Microsoft Software License Terms</a> to:</p>
                  <p className="text text--7 text--indented">User</p>
                </div>
              </div>
              
              <div className={css['bottom']}>
                <button 
                  type="button"
                  className={`${css['button']} form-button form-button--active`}
                  onClick={() => setIsOpen(false) }
                >
                  OK
                </button>
              </div>

            </div>
          </>
        );
      }}
    />
  );
});

export default AboutWindow;