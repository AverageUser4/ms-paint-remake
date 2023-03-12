import React, { forwardRef, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import css from './FileDropdown.module.css';

import FileDropdownMore from '../FileDropdownMore/FileDropdownMore';
import Dropdown from '../Dropdown/Dropdown';
import Tooltip from '../Tooltip/Tooltip';

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

const FileDropdown = forwardRef(function FileDropdown(props, ref) {
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

  function close() {
    if(isShown)
      setIsShown(false);
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
            onPointerDown={close}
            className="ribbon-button ribbon-button--blue"
            data-cy="FileDropdown-close"
          >
            File
          </button>
        </div>
    
        <div className={css['middle']}>
          <div className={css['left']}>
    
            <button className={`tooltip-container ${css['button']}`}>
              <img src={new32} alt=""/>
              <span className="text text--1"><span className="text--underline">N</span>ew</span>
              <Tooltip
                heading="New (Ctrl+N)"
                text="Create a new picture."
              />
            </button>
    
            <button className={`tooltip-container ${css['button']}`}>
              <img src={open32} alt=""/>
              <span className="text text--1"><span className="text--underline">O</span>pen</span>
              <Tooltip
                heading="Open (Ctrl+O)"
                text="Open an existing picture."
              />
            </button>
    
            <button className={`tooltip-container ${css['button']}`}>
              <img src={save32} alt=""/>
              <span className="text text--1"><span className="text--underline">S</span>ave</span>
              <Tooltip
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
              <button className={`tooltip-container ${css['button']}`}>
                <img src={saveAs32} alt=""/>
                <span className="text text--1">Save <span className="text--underline">a</span>s</span>
                <Tooltip
                  heading="Save as (F12)"
                  text="Save the current picture as a new file."
                />
              </button>
    
              <button 
                onPointerDown={(e) => e.button === 0 && setCurrentMore('save')} className={css['arrow-button']}
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
              <button className={`tooltip-container ${css['button']}`}>
                <img src={print32} alt=""/>
                <span className="text text--1"><span className="text--underline">P</span>rint</span>
                <Tooltip
                  heading="Print (Ctrl+P)"
                  text="Print the current picture."
                />
              </button>
    
              <button 
                onPointerDown={(e) => e.button === 0 && setCurrentMore('print')} className={css['arrow-button']}
                data-cy="FileDropdown-duo-arrow-print"
              >
                <ArrowRight/>
              </button>
            </div>
            
            <button className={`tooltip-container ${css['button']}`}>
              <img src={scanner32} alt=""/>
              <span className="text text--1">Fro<span className="text--underline">m</span> scanner or camera</span>
              <Tooltip
                text="Import from scanner or camera."
              />
            </button>
    
            <button className={`tooltip-container ${css['button']}`}>
              <img src={email32} alt=""/>
              <span className="text text--1">Sen<span className="text--underline">d</span> in email</span>
              <Tooltip
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
              <button className={`tooltip-container ${css['button']}`}>
                <img src={set32} alt=""/>
                <span className="text text--1">Set as desktop <span className="text--underline">b</span>ackground</span>
                <Tooltip
                  heading="Desktop background"
                  text="Set the current picture as your desktop background."
                />
              </button>
    
              <button 
                onPointerDown={(e) => e.button === 0 && setCurrentMore('set')} className={css['arrow-button']}
                data-cy="FileDropdown-duo-arrow-set"
              >
                <ArrowRight/>
              </button>
            </div>
    
            <div className={css['border']}></div>
    
            <button className={`tooltip-container ${css['button']}`}>
              <img src={properties32} alt=""/>
              <span className="text text--1">Prop<span className="text--underline">e</span>rties</span>
              <Tooltip
                heading="Properties (Ctrl+E)"
                text="Change the properties of the picture."
              />
            </button>
    
            <div className={css['border']}></div>
    
            <button className={`${css['button']}`}>
              <img src={about32} alt=""/>
              <span className="text text--1">Abou<span className="text--underline">t</span> paint</span>
            </button>
    
            <div className={css['border']}></div>
    
            <button className={`${css['button']}`}>
              <img src={exit32} alt=""/>
              <span className="text text--1">E<span className="text--underline">x</span>it</span>
            </button>
    
          </div>
          
          <div 
            className={css['right']}
            onMouseEnter={() => clearTimeout(timeoutRef.current)}
            onMouseLeave={onMouseLeave}
          >
            <FileDropdownMore currentMore={currentMore}/>
          </div>
        </div>
    
        <div className={css['bottom']}></div>
      </div>
    </Dropdown>
  );
});

FileDropdown.propTypes = {
  isShown: PropTypes.bool.isRequired,
  setIsShown: PropTypes.func.isRequired
};

export default FileDropdown;