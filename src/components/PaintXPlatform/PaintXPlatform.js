import React, { useState } from 'react';
import css from './PaintXPlatform.module.css';

import Window from '../Window/Window';
import CanvasContainer from '../CanvasContainer/CanvasContainer';
import Ribbon from '../Ribbon/Ribbon';
import RibbonControls from '../RibbonControls/RibbonControls';
import TopBar from '../TopBar/TopBar';
import BottomBar from '../BottomBar/BottomBar';
import QuickAccessToolbar from '../QuickAccessToolbar/QuickAccessToolbar';

function PaintXPlatform() {
  const [repositionToolbar, setRepositionToolbar] = useState(true);
  const [toolbarButtons, setToolbarButtons] = useState(['save', 'undo', 'redo']);
  const [activeRibbonTab, setActiveRibbonTab] = useState('home');
  const [hideRibbon, setHideRibbon] = useState(true);

  const items = [
    {
      Component: TopBar, 
      props: { 
        repositionToolbar,
        setRepositionToolbar,
        toolbarButtons,
        setToolbarButtons,
        hideRibbon,
        setHideRibbon,
      }
    },
    { 
      Component: RibbonControls,
      props: { 
        activeRibbonTab,
        setActiveRibbonTab,
        hideRibbon,
        setHideRibbon,
      }
    },
    { 
      Component: Ribbon,
      props: { 
        activeRibbonTab,
        hideRibbon
      }
    },
    (
      repositionToolbar ?
        { 
          Component: QuickAccessToolbar,
          props: { 
            repositionToolbar,
            setRepositionToolbar,
            availableButtons: toolbarButtons,
            setAvailableButtons: setToolbarButtons,
            hideRibbon,
            setHideRibbon
          }
        }
      :
        null
    ),
    { 
      Component: CanvasContainer,
      props: { 
        repositionToolbar 
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