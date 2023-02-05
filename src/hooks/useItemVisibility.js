import { useEffect, useState } from "react";

function useItemVisibility(currentWidth, minimalWidth) {
  const [shouldShow, setShouldShow] = useState(currentWidth >= minimalWidth);

  useEffect(() => {
    if(currentWidth < minimalWidth && shouldShow)
      setShouldShow(false);
    else if(currentWidth >= minimalWidth && !shouldShow)
      setShouldShow(true);
  }, [shouldShow, currentWidth, minimalWidth]);

  return shouldShow;
}

export default useItemVisibility;