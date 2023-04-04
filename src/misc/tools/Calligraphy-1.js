import BrushBase from "./BrushBase";

class Calligraphy_1 extends BrushBase {
  sizes = [3, 5, 8, 10];
  chosenSize = 5;
  
  draw({ secondaryContext, thumbnailSecondaryContext, currentPixel }) {
    this.validate(arguments, ['secondaryContext', 'thumbnailSecondaryContext', 'currentPixel']);
  
    const size = this.chosenSize;
    let offset = Math.floor(size / 2);
  
    function drawToContext(context) {
      for(let i = 0; i < size; i++) {
        context.fillRect(currentPixel.x - offset, currentPixel.y + offset, 2, 1);
        offset--;
      }
    }
  
    drawToContext(secondaryContext);
    thumbnailSecondaryContext && drawToContext(thumbnailSecondaryContext);
  }
}

export default new Calligraphy_1();