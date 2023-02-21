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
      { name: 'minimalSize', value: minimalSize, type: 'object' },
      { name: 'position', value: position, type: 'object' },
      { name: 'size', value: size, type: 'object' },
      { name: 'setSize', value: setSize, type: 'function' },
      { name: 'isAutoShrink', value: isAutoShrink, type: 'boolean' },
      { name: 'isAutoFit', value: isAutoFit, type: 'boolean' },
      { name: 'isResizable', value: isResizable, type: 'boolean' },
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