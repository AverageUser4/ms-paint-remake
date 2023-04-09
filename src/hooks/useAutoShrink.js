import { useEffect } from "react";
import { checkArgs } from "../misc/utils";

export default function useAutoFit({
  containerRect,
  minimalSize,
  position,
  size,
  setSize,
  isAutoShrink,
  isAutoFit,
  isResizable,
}) {
  useEffect(() => {
    if(!isAutoShrink || !isResizable || !containerRect) {
      return;
    }
    checkArgs([
      { minimalSize, type: 'object' },
      { position, type: 'object' },
      { size, type: 'object' },
      { setSize, type: 'function' },
      { isAutoShrink, type: 'boolean' },
      { isAutoFit, type: 'boolean' },
      { isResizable, type: 'boolean' },
    ]);

    let newWidth = size.width;
    let newHeight = size.height;

    if((position.x === 0 || !isAutoFit) && position.x + size.width > containerRect.width) {
      newWidth = Math.max(containerRect.width - position.x, minimalSize.width);
    }
    if((position.y === 0 || !isAutoFit) && position.y + size.height > containerRect.height) {
      newHeight = Math.max(containerRect.height - position.y, minimalSize.height);
    }

    if(isResizable && (newWidth !== size.width || newHeight !== size.height)) {
      setSize({ width: newWidth, height: newHeight });
    }
  }, [containerRect, size, setSize, position, minimalSize, isAutoShrink, isAutoFit, isResizable]);
}