import BrushBase from "./BrushBase";

class Watercolor extends BrushBase {
  sizes = [8, 16, 30, 40];
  chosenSize = 16;
}

export default new Watercolor();