import React, { useState } from 'react';

import Window from '../Window/Window';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';
import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';

function PaintXPlatform() {
  const [toolbarData, setToolbarData] = useState({ reposition: false, buttons: ['save', 'undo', 'redo'] });
  const [ribbonData, setRibbonData] = useState({ minimize: false, activeTab: 'home', expand: false });
  
  const items = [
    {
      Component: TopBar, 
      props: { 
        toolbarData,
        setToolbarData,
        ribbonData,
        setRibbonData
      }
    },
    { 
      Component: RibbonControls,
      props: { 
        ribbonData,
        setRibbonData
      }
    },
    { 
      Component: Ribbon,
      props: { 
        ribbonData,
        setRibbonData
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
            setRibbonData
          }
        }
      :
        null
    ),
    { 
      Component: CanvasContainer,
      props: { 
        toolbarData,
        ribbonData
      }
    },
    { 
      Component: BottomBar,
      props: {} 
    }
  ];

  return (
    <Window items={items}/>
  );
}

export default PaintXPlatform;