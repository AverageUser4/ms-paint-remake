import BrushBase from "./BrushBase";

class Crayon extends BrushBase {
  sizes = [8, 16, 30, 40];
  chosenSize = 16;
}

export default new Crayon();