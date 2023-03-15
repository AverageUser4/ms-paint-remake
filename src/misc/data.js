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
  { multiplier: 0.50, offset: 23 },
  { multiplier: 1, offset: 45 },
  { multiplier: 2, offset: 51 },
  { multiplier: 3, offset: 57 },
  { multiplier: 4, offset: 63 },
  { multiplier: 5, offset: 68 },
  { multiplier: 6, offset: 73 },
  { multiplier: 7, offset: 78 },
  { multiplier: 8, offset: 83 },
];