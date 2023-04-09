import { useEffect } from "react";
import { checkArgs } from "../misc/utils";

export default function useAutoFit({
  containerRect,
  position,
  setPosition,
  size,
  isAutoFit,
}) {
  checkArgs([
    { position, type: 'object' },
    { setPosition, type: 'function' },
    { size, type: 'object' },
    { isAutoFit, type: 'boolean' },
  ]);
  
  useEffect(() => {
    if(!isAutoFit || !containerRect) {
      return;
    }

    let newX = position.x;
    let newY = position.y;

    if(position.x + size.width > containerRect.width) {
      newX = Math.max(containerRect.width - size.width, 0);
    }
    if(position.y + size.height > containerRect.height) {
      newY = Math.max(containerRect.height - size.height, 0);
    }

    if(newX !== position.x || newY !== position.y) {
      setPosition({ x: newX, y: newY });
    }
  }, [containerRect, size, position, isAutoFit, setPosition]);
}