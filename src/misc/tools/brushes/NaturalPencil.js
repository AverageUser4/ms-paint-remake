import BrushBase from "./BrushBase";

class NaturalPencil extends BrushBase {
  sizes = [8, 16, 30, 40];
  chosenSize = 16;
}

export default new NaturalPencil();