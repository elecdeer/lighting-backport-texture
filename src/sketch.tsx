import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";

export const sketch = (p5: P5CanvasInstance) => {
  p5.setup = () => {
    p5.createCanvas(400, 400);
    p5.background(p5.random(0, 255), p5.random(0, 255), p5.random(0, 255));
  };

  p5.draw = () => {};
};

export const SketchContainer = () => {
  return <ReactP5Wrapper sketch={sketch} />;
};
