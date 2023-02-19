import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import css from './PromptWindow.module.css';

import Window from '../Window/Window';
import InnerWindowTopBar from '../InnerWindowTopBar/InnerWindowTopBar';
import { getWindowCenteredPosition } from '../../misc/utils';
import { useMainWindowContext } from '../../misc/MainWindowContext';

const WIDTH = 350;
const HEIGHT = 135;

const PromptWindow = memo(function PromptWindow({ isOpen, setIsOpen }) {
  const { mainWindowPosition, mainWindowSize } = useMainWindowContext();
  const [size, setSize] = useState({ width: WIDTH, height: HEIGHT });
  const [position, setPosition] = useState(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, size));
  
  useEffect(() => {
    if(isOpen) {
      setSize({ width: WIDTH, height: HEIGHT });
      setPosition(getWindowCenteredPosition(mainWindowPosition, mainWindowSize, { width: size.width, height: size.height }));
    }
  }, [isOpen, mainWindowPosition, mainWindowSize, size.width, size.height]);

  const items = [
    {
      Component: InnerWindowTopBar, 
      props: {
        text: 'Paint',
        close: () => setIsOpen(false)
      }
    },
    {
      Component: PromptWindowBody, 
      props: {
        setIsOpen
      }
    },
  ];

  return (
    <Window
      isOpen={isOpen}
      items={items}
      size={size}
      setSize={setSize}
      position={position}
      setPosition={setPosition}
      isResizable={false}
      isInnerWindow={true}
    />
  );
});

PromptWindow.propTypes = {
  containerDimensions: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

function PromptWindowBody({ setIsOpen }) {
  return (
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
        >
          Cancel
        </button>
      </div>
      
    </div>
  );
}

PromptWindowBody.propTypes = {
  setIsOpen: PropTypes.func.isRequired,
};

export default PromptWindow;