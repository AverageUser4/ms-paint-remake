export const innerWindowConfig = {
  minimalSize: { width: 1, height: 1 },
  isInnerWindow: true,
  isFocused: false,
  isResizable: false,
  isAutoShrink: false,
  isIgnorePointerEvents: false,
  isMaximized: false,
  setIsFocused: ()=>0,
};

export const initialCanvasSize = {
  width: 300,
  height: 200
};

export const MAX_CANVAS_SIZE = 4_000;