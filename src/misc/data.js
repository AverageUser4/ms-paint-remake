import cursorDraw from '../assets/cursors/draw.png';
import cursorPencil from '../assets/cursors/pencil.png';
import cursorFill from '../assets/cursors/fill.png';
import cursorColorPicker from '../assets/cursors/picker.png';
import cursorSelection from '../assets/cursors/select.png';
import cursorAirbrush from '../assets/cursors/spray.png';
import cursorText from '../assets/cursors/text.png';
import cursorMagnifier from '../assets/cursors/zoom.png';

export const innerWindowConfig = {
  minimalSize: { width: 1, height: 1 },
  isInnerWindow: true,
  isFocused: false,
  isResizable: false,
  isAutoShrink: false,
  isIgnorePointerEvents: false,
  isMaximized: false,
  isBlockingMainWindow: true,
  setIsFocused: ()=>0,
};

export const initialCanvasSize = {
  width: 300,
  height: 200
};

export const MAX_CANVAS_SIZE = 4_000;

export const zoomData = [
  { multiplier: 0.125, offset: 7 },
  { multiplier: 0.25, offset: 12 },
  { multiplier: 0.5, offset: 23 },
  { multiplier: 1, offset: 45 },
  { multiplier: 2, offset: 51 },
  { multiplier: 3, offset: 57 },
  { multiplier: 4, offset: 63 },
  { multiplier: 5, offset: 68 },
  { multiplier: 6, offset: 73 },
  { multiplier: 7, offset: 78 },
  { multiplier: 8, offset: 83 },
];

export const cursorData = {
  draw: {
    default: `url(${cursorDraw}) 9 9, default`,
  },
  pencil: {
    default: `url(${cursorPencil}) 3 14, default`,
    '2': `url(${cursorPencil}) 2 13, default`,
    '3': `url(${cursorPencil}) 2 13, default`,
    '4': `url(${cursorPencil}) 2 12, default`,
    '5': `url(${cursorPencil}) 1 12, default`,
    '6': `url(${cursorPencil}) 1 12, default`,
    '7': `url(${cursorPencil}) 1 12, default`,
    '8': `url(${cursorPencil}) 0 10, default`,
  },
  fill: {
    default: `url(${cursorFill}) 4 12, default`,
    '7': `url(${cursorFill}) 4 11, default`,
    '8': `url(${cursorFill}) 1 11, default`,
  },
  'color-picker': {
    '0.125': `url(${cursorColorPicker}) 0 14, default`,
    '0.25': `url(${cursorColorPicker}) 0 14, default`,
    '0.5': `url(${cursorColorPicker}) 0 14, default`,
    '1': `url(${cursorColorPicker}) 0 14, default`,
    '2': `url(${cursorColorPicker}) 0 14, default`,
    '3': `url(${cursorColorPicker}) 0 14, default`,
    '4': `url(${cursorColorPicker}) 0 14, default`,
    '5': `url(${cursorColorPicker}) 0 14, default`,
    '6': `url(${cursorColorPicker}) 0 14, default`,
    '7': `url(${cursorColorPicker}) 0 14, default`,
    '8': `url(${cursorColorPicker}) 0 14, default`,
  },
};

// cursor: none for eraser
// --cursor-draw: url(../assets/cursors/draw.png) 9 9, default;
// --cursor-pencil: url(../assets/cursors/pencil.png) 1 14, default;
// --cursor-fill: url(../assets/cursors/fill.png) 1 12, default;
// --cursor-color-picker: url(../assets/cursors/picker.png) 0 14, default;
// --cursor-selection: url(../assets/cursors/select.png) 10 10, default;
// --cursor-airbrush: url(../assets/cursors/spray.png) 0 12, default;
// --cursor-text: url(../assets/cursors/text.png) 3 9, default;
// --cursor-magnifier: url(../assets/cursors/zoom.png) 5 5, default;