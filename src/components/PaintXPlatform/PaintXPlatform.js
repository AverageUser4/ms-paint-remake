import React, { useCallback, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import Window from '../Window/Window';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';
import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';
import ContextMenu from '../ContextMenu/ContextMenu';
import ResizeWindow from '../ResizeWindow/ResizeWindow';
import ColorsWindow from '../ColorsWindow/ColorsWindow';
import PromptWindow from '../PromptWindow/PromptWindow';
import { ContextMenuProvider } from '../../misc/ContextMenuContext';
import { ContainerProvider } from '../../misc/ContainerContext';
import { CanvasProvider } from '../../misc/CanvasContext';
import { HistoryProvider } from '../../misc/HistoryContext';
import { useMainWindowContext, MainWindowProvider } from '../../misc/MainWindowContext';
import { ColorProvider } from '../../misc/ColorContext';
import { ToolProvider } from '../../misc/ToolContext';
import { SelectionProvider } from '../../misc/SelectionContext';

function Logic({ 
  minimalSize,
  isResizable,
  isAutoShrink,
  isOpen,
}) {
  const { 
    isMainWindowFocused, setIsMainWindowFocused,
    mainWindowPosition, setMainWindowPosition,
    mainWindowSize, setMainWindowSize,
    isMainWindowMaximized, setIsMainWindowMaximized
  } = useMainWindowContext();

  const doSetWindowToMinimalSize = useCallback(() => {
    setMainWindowSize(minimalSize);
    setIsMainWindowMaximized(false);
  }, [setMainWindowSize, minimalSize, setIsMainWindowMaximized]);

  const [isResizeWindowOpen, setIsResizeWindowOpen] = useState(false);
  const [isColorsWindowOpen, setIsColorsWindowOpen] = useState(false);
  const [isPromptWindowOpen, setIsPromptWindowOpen] = useState(false);

  const isAnyInnerWindowOpen = isResizeWindowOpen || isColorsWindowOpen || isPromptWindowOpen;
  
  const [toolbarData, setToolbarData] = useState({ reposition: false, buttons: ['save', 'undo', 'redo'] });

  const [ribbonData, setRibbonData] = useState({ 
    minimize: false,
    activeTab: 'home',
    expand: false,
    toggleMinimize: () => setRibbonData(prev => ({ ...prev, minimize: !prev.minimize, expand: false })),
    stopExpanding: () => setRibbonData(prev => ({ ...prev, expand: false })),
    // uses setTimeout so it does not get closed immediately after being open due to event listener on window
    setTab: (tabName) => setTimeout(() => setRibbonData(prev => ({ ...prev, activeTab: tabName, expand: true })))
  });

  useEffect(() => {
    if(isAnyInnerWindowOpen && isMainWindowFocused) {
      setIsMainWindowFocused(false);
    }
  }, [isAnyInnerWindowOpen, isMainWindowFocused, setIsMainWindowFocused]);

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
    >
      <Window 
        ID="PaintWindow"
        minimalSize={minimalSize}
        position={mainWindowPosition}
        setPosition={setMainWindowPosition}
        size={mainWindowSize}
        setSize={setMainWindowSize}
        isFocused={isMainWindowFocused}
        setIsFocused={setIsMainWindowFocused}
        isResizable={isResizable}
        isAutoShrink={isAutoShrink}
        isIgnorePointerEvents={isAnyInnerWindowOpen}
        isMaximized={isMainWindowMaximized}
        isOpen={isOpen}
        isInnerWindow={false}
        render={(isAttentionAnimated, onPointerDownMove) => {
          return (
            <>
              <TopBar
                toolbarData={toolbarData}
                setToolbarData={setToolbarData}
                ribbonData={ribbonData}
                setIsPromptWindowOpen={setIsPromptWindowOpen}
                doSetWindowToMinimalSize={doSetWindowToMinimalSize}
                windowHasFocus={isMainWindowFocused}
                onPointerDownMove={onPointerDownMove}
              />
              <RibbonControls
                ribbonData={ribbonData}
              />
              <Ribbon
                ribbonData={ribbonData}
                setIsResizeWindowOpen={setIsResizeWindowOpen}
                setIsColorsWindowOpen={setIsColorsWindowOpen}
                windowWidth={mainWindowSize.width}
              />
              {
                toolbarData.reposition &&
                  <QuickAccessToolbar
                    toolbarData={toolbarData}
                    setToolbarData={setToolbarData}
                    ribbonData={ribbonData} 
                  />
              }
              <CanvasContainer
                toolbarData={toolbarData}
                ribbonData={ribbonData}
              />
              <BottomBar
                windowWidth={mainWindowSize.width}
              />
              <ContextMenu/>
            </>
          );
        }}
      />

      <ResizeWindow
        isOpen={isResizeWindowOpen}
        setIsOpen={setIsResizeWindowOpen}
      />

      <ColorsWindow
        isOpen={isColorsWindowOpen}
        setIsOpen={setIsColorsWindowOpen}
      />

      <PromptWindow
        isOpen={isPromptWindowOpen}
        setIsOpen={setIsPromptWindowOpen}
      />
    </div>
  );
}

Logic.propTypes = {
  minimalSize: PropTypes.shape({ 
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired 
  }).isRequired,
  isResizable: PropTypes.bool.isRequired,
  isAutoShrink: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

function PaintXPlatform({
  minimalSize = { width: 460, height: 300 },
  initialPosition = { x: 200, y: 100 },
  initialSize = { width: 900, height: 600 }, //{ width: 600, height: 500 },
  isResizable = true,
  isConstrained = true,
  isAutoShrink = true,
  isAutoFit = true,
  isOpen = true,
  isInitiallyMaximized = false,
  isAllowToLeaveViewport = false,
}) {
  const containerRef = useRef();

  return (
    <div 
      style={{ 
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
      ref={containerRef}
    >
      <ContainerProvider 
        containerRef={containerRef}
        isConstrained={isConstrained}
        isAutoFit={isAutoFit}
        isAllowToLeaveViewport={isAllowToLeaveViewport}
      >
        <ColorProvider>
          <CanvasProvider>
            <HistoryProvider>
              <ToolProvider>
                <SelectionProvider>
                  <MainWindowProvider
                    initialPosition={initialPosition}
                    initialSize={initialSize}
                    isInitiallyMaximized={isInitiallyMaximized}
                  >
                    <ContextMenuProvider>
                      <Logic 
                        minimalSize={minimalSize}
                        isResizable={isResizable}
                        isAutoShrink={isAutoShrink}
                        isOpen={isOpen}
                      />
                    </ContextMenuProvider>
                  </MainWindowProvider>
                </SelectionProvider>
              </ToolProvider>
            </HistoryProvider>
          </CanvasProvider>
        </ColorProvider>
      </ContainerProvider>
    </div>
  );
}

PaintXPlatform.propTypes = {
  isConstrained: PropTypes.bool,
  isResizable: PropTypes.bool,
  isAutoShrink: PropTypes.bool,
  isAutoFit: PropTypes.bool,
  isOpen: PropTypes.bool,
  isInitiallyMaximized: PropTypes.bool,
  isAllowToLeaveViewport: PropTypes.bool,
  initialPosition: PropTypes.shape({ 
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired 
  }),
  initialSize: PropTypes.shape({ 
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired 
  }),
  minimalSize: PropTypes.shape({ 
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired 
  }),
};

export default PaintXPlatform;