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
import { useMainWindowContext, MainWindowProvider } from '../../misc/MainWindowContext';

function Logic({ 
  minimalSize,
  isResizable,
  isAutoShrink,
  isOpen,
  isAllowToLeaveViewport
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
  
  const [canvasData, setCanvasData] = useState({
    mousePosition: null,
    size: { width: 300, height: 200 },
    outlineSize: null,
  });

  useEffect(() => {
    if(isAnyInnerWindowOpen && isMainWindowFocused) {
      setIsMainWindowFocused(false);
    }
  }, [isAnyInnerWindowOpen, isMainWindowFocused, setIsMainWindowFocused]);

  const items = [
    {
      Component: TopBar, 
      props: { 
        toolbarData,
        setToolbarData,
        ribbonData,
        setIsPromptWindowOpen,
        doSetWindowToMinimalSize
      }
    },
    { 
      Component: RibbonControls,
      props: { 
        ribbonData,
      }
    },
    { 
      Component: Ribbon,
      props: { 
        ribbonData,
        setIsResizeWindowOpen,
        setIsColorsWindowOpen,
      }
    },
    (
      toolbarData.reposition ?
        { 
          Component: QuickAccessToolbar,
          props: { 
            toolbarData,
            setToolbarData,
            ribbonData,
          }
        }
      :
        null
    ),
    { 
      Component: CanvasContainer,
      props: { 
        toolbarData,
        ribbonData,
        canvasData,
        setCanvasData
      }
    },
    { 
      Component: BottomBar,
      props: { 
        canvasData 
      } 
    },
    {
      Component: ContextMenu,
      props: {}
    },
  ];

  return (
    <div 
      onContextMenu={(e) => e.preventDefault()}
    >
      <Window 
        items={items}
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
        isAllowToLeaveViewport={isAllowToLeaveViewport}
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
  isAllowToLeaveViewport: PropTypes.bool.isRequired,
};

function PaintXPlatform({
  minimalSize = { width: 460, height: 300 },
  initialPosition = { x: 200, y: 100 },
  initialSize = { width: 600, height: 500 },
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
      >
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
              isAllowToLeaveViewport={isAllowToLeaveViewport}
            />
          </ContextMenuProvider>
        </MainWindowProvider>
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