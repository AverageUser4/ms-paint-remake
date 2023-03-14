import React, { forwardRef, memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './FileDropdown.module.css';

import FileDropdownMore from '../FileDropdownMore/FileDropdownMore';
import Dropdown from '../Dropdown/Dropdown';
import Tooltip from '../Tooltip/Tooltip';

import { useActionsContext } from '../../context/ActionsContext';
import { useWindowsContext } from '../../context/WindowsContext';

import about32 from './assets/about-32.png';
import email32 from './assets/email-32.png';
import exit32 from './assets/exit-32.png';
import new32 from './assets/new-32.png';
import open32 from './assets/open-32.png';
import print32 from './assets/print-32.png';
import properties32 from './assets/properties-32.png';
import save32 from './assets/save-32.png';
import saveAs32 from './assets/save-as-32.png';
import scanner32 from './assets/scanner-32.png';
import set32 from './assets/set-32.png';
import { ReactComponent as ArrowRight } from '../../assets/global/arrow-right.svg';

const FileDropdown = memo(forwardRef(function FileDropdown(props, ref) {
  const { doStartNewProject, doOpenNewFile, doSaveFile } = useActionsContext();
  const { setIsAboutWindowOpen, setIsPropertiesWindowOpen } = useWindowsContext();
  const [currentMore, setCurrentMore] = useState('recent');
  const timeoutRef = useRef();
  const { isShown, setIsShown } = props;

  function onMouseEnter(which) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCurrentMore(which), 500);
  }
  
  function onMouseLeave() {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCurrentMore('recent'), 500);
  }
  
  return (
    <Dropdown 
      adjustPosition={false}
      isVisible={isShown}
      setIsVisible={setIsShown}
      classes={css['container']}
      ref={ref}
    >
      <div data-cy="FileDropdown">
        <div className={css['top']}>
          <button 
            onClick={() => setIsShown(false)}
            className="ribbon-button ribbon-button--blue"
            data-cy="FileDropdown-close"
          >
            File
          </button>
        </div>
    
        <div className={css['middle']}>
          <div className={css['left']}>
    
            <button 
              aria-describedby="id-fd-new"
              className={`tooltip-container ${css['button']}`}
              onClick={() => {
                doStartNewProject();
                setIsShown(false);
              }}
            >
              <img src={new32} alt=""/>
              <span className="text text--1"><span className="text--underline">N</span>ew</span>
              <Tooltip
                ID="id-fd-new"
                heading="New (Ctrl+N)"
                text="Create a new picture."
              />
            </button>
    
            <button 
              aria-describedby="id-fd-open"
              className={`tooltip-container ${css['button']}`}
              onClick={() => {
                doOpenNewFile();
                setIsShown(false);
              }}
            >
              <img src={open32} alt=""/>
              <span className="text text--1"><span className="text--underline">O</span>pen</span>
              <Tooltip
                ID="id-fd-open"
                heading="Open (Ctrl+O)"
                text="Open an existing picture."
              />
            </button>
    
            <button 
              aria-describedby="id-fd-save"
              className={`tooltip-container ${css['button']}`}
              onClick={() => {
                doSaveFile();
                setIsShown(false);
              }}
            >
              <img src={save32} alt=""/>
              <span className="text text--1"><span className="text--underline">S</span>ave</span>
              <Tooltip
                ID="id-fd-save"
                heading="Save (Ctrl+S)"
                text="Save the current picture."
              />
            </button>
    
            <div 
              className={`${css['duo-container']} ${currentMore === 'save' ? css['duo-container--active'] : ''}`}
              onMouseEnter={() => onMouseEnter('save')}
              onMouseLeave={onMouseLeave}
              data-cy="FileDropdown-duo-save"
            >
              <button 
                aria-describedby="id-fd-save-as"
                className={`tooltip-container ${css['button']}`}
                onClick={() => {
                  doSaveFile();
                  setIsShown(false);
                }}
              >
                <img src={saveAs32} alt=""/>
                <span className="text text--1">Save <span className="text--underline">a</span>s</span>
                <Tooltip
                  ID="id-fd-save-as"
                  heading="Save as (F12)"
                  text="Save the current picture as a new file."
                />
              </button>
    
              <button 
                onClick={(e) => e.button === 0 && setCurrentMore('save')} 
                className={css['arrow-button']}
                data-cy="FileDropdown-duo-arrow-save"
              >
                <ArrowRight/>
              </button>
            </div>
    
            <div className={css['border']}></div>
    
            <div
              className={`${css['duo-container']} ${currentMore === 'print' ? css['duo-container--active'] : ''}`}
              onMouseEnter={() => onMouseEnter('print')}
              onMouseLeave={onMouseLeave}
              data-cy="FileDropdown-duo-print"
            >
              <button 
                disabled
                aria-describedby="id-fd-print"
                className={`tooltip-container ${css['button']}`}
                onClick={() => {
                  setIsShown(false);
                }}
              >
                <img src={print32} alt=""/>
                <span className="text text--1"><span className="text--underline">P</span>rint</span>
                <Tooltip
                  ID="id-fd-print"
                  heading="Print (Ctrl+P)"
                  text="Print the current picture."
                />
              </button>
    
              <button 
                onClick={(e) => e.button === 0 && setCurrentMore('print')} 
                className={css['arrow-button']}
                data-cy="FileDropdown-duo-arrow-print"
              >
                <ArrowRight/>
              </button>
            </div>
            
            <button 
              disabled
              aria-describedby="id-fd-scanner"
              className={`tooltip-container ${css['button']} ${css['button--disabled']}`}
              onClick={() => {
                setIsShown(false);
              }}
            >
              <img src={scanner32} alt=""/>
              <span className="text text--1">Fro<span className="text--underline">m</span> scanner or camera</span>
              <Tooltip
                ID="id-fd-scanner"
                text="Import from scanner or camera."
              />
            </button>
    
            <button 
              disabled
              aria-describedby="id-fd-email"
              className={`tooltip-container ${css['button']} ${css['button--disabled']}`}
              onClick={() => {
                setIsShown(false);
              }}
            >
              <img src={email32} alt=""/>
              <span className="text text--1">Sen<span className="text--underline">d</span> in email</span>
              <Tooltip
                ID="id-fd-email"
                heading="Email"
                text="Send a copy of the picture in an email message as an attachment."
              />
            </button>
    
            <div className={css['border']}></div>
    
            <div 
              className={`${css['duo-container']} ${currentMore === 'set' ? css['duo-container--active'] : ''}`}
              onMouseEnter={() => onMouseEnter('set')}
              onMouseLeave={onMouseLeave}
              data-cy="FileDropdown-duo-set"
            >
              <button 
                disabled
                aria-describedby="id-fd-desktop"
                className={`tooltip-container ${css['button']}`}
                onClick={() => {
                  setIsShown(false);
                }}
              >
                <img src={set32} alt=""/>
                <span className="text text--1">Set as desktop <span className="text--underline">b</span>ackground</span>
                <Tooltip
                  ID="id-fd-desktop"
                  heading="Desktop background"
                  text="Set the current picture as your desktop background."
                />
              </button>
    
              <button 
                onClick={(e) => e.button === 0 && setCurrentMore('set')} 
                className={css['arrow-button']}
                data-cy="FileDropdown-duo-arrow-set"
              >
                <ArrowRight/>
              </button>
            </div>
    
            <div className={css['border']}></div>
    
            <button 
              aria-describedby="id-fd-properties"
              className={`tooltip-container ${css['button']}`}
              onClick={() => {
                setIsPropertiesWindowOpen(true);
                setIsShown(false);
              }}
            >
              <img src={properties32} alt=""/>
              <span className="text text--1">Prop<span className="text--underline">e</span>rties</span>
              <Tooltip
                ID="id-fd-properties"
                heading="Properties (Ctrl+E)"
                text="Change the properties of the picture."
              />
            </button>
    
            <div className={css['border']}></div>
    
            <button 
              className={`${css['button']}`}
              onClick={() => {
                setIsAboutWindowOpen(true);
                setIsShown(false);
              }}
            >
              <img src={about32} alt=""/>
              <span className="text text--1">Abou<span className="text--underline">t</span> paint</span>
            </button>
    
            <div className={css['border']}></div>
    
            <button 
              className={`${css['button']}`}
              onClick={() => {
                doStartNewProject();
                setIsShown(false);
              }}
            >
              <img src={exit32} alt=""/>
              <span className="text text--1">E<span className="text--underline">x</span>it</span>
            </button>
    
          </div>
          
          <div 
            className={css['right']}
            onMouseEnter={() => clearTimeout(timeoutRef.current)}
            onMouseLeave={onMouseLeave}
          >
            <FileDropdownMore 
              currentMore={currentMore}
              setCurrentMore={setCurrentMore}
              setIsShown={setIsShown}
            />
          </div>
        </div>
    
        <div className={css['bottom']}></div>
      </div>
    </Dropdown>
  );
}));

FileDropdown.propTypes = {
  isShown: PropTypes.bool.isRequired,
  setIsShown: PropTypes.func.isRequired,
};

export default FileDropdown;