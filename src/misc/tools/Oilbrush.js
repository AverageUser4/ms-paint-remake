import BrushBase from "./BrushBase";

class OilBrush extends BrushBase {
  sizes = [8, 16, 30, 40];
  chosenSize = 16;
}

export default new OilBrush();