export function toggleBoolState(isOn, setIsOn) {
  if(isOn)
    setIsOn(false);
  else
    setTimeout(() => setIsOn(true));
}