import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import css from './CanvasContainer.module.css';

import Canvas from '../Canvas/Canvas';
import Rulers from '../Rulers/Rulers';

import { useWindowsContext } from '../../context/WindowsContext';
import { useSelectionContext } from '../../context/SelectionContext';
import { useLineContext } from '../../context/LineContext';

const CanvasContainer = memo(function CanvasContainer({ toolbarData, ribbonData }) {
  const { isStatusBarVisible, isRulersVisible } = useWindowsContext();
  const { selectionPhase, doSelectionDrawToPrimary, doSelectionEnd } = useSelectionContext();
  const { linePhase, doLineDrawToPrimary, doLineEnd } = useLineContext();
  const containerRef = useRef();
  
  const containerStyle = {
    height: `calc(
      100%
      ${!ribbonData.minimize ? '- var(--ribbon-height)' : ''}
      - var(--ribbon-controls-height)
      - var(--topbar-height)
      ${isStatusBarVisible ? '- var(--statusbar-height)' : ''}
      ${toolbarData.reposition ? '- var(--qa-toolbar-height)' : ''}
    )`
  };

  return (
    <div 
      className={`
        ${css['container']}
        ${isRulersVisible && css['container--has-rulers']}
      `}
      ref={containerRef}
      style={containerStyle}
      onPointerDown={(event) => {
        if(event.target === containerRef.current) {
          if(selectionPhase === 2) {
            doSelectionDrawToPrimary();
            doSelectionEnd();
          }
          if(linePhase) {
            doLineDrawToPrimary();
            doLineEnd();
          }
        }
      }}
    >
      {isRulersVisible && <Rulers containerRef={containerRef}/>}
      <Canvas/>
    </div>
  );
});

CanvasContainer.propTypes = {
  ribbonData: PropTypes.object.isRequired,
  toolbarData: PropTypes.object.isRequired,
};

export default CanvasContainer;