import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { Image, Vector } from "p5";
import { FC } from "react";
import { toDataURL } from "./lib/useFileImage";
import { background } from "@chakra-ui/react";

type Props = {
  colorMap: File;
  normalMap: File;
  ambientMap: File;
};

export type MapType = "color" | "normal" | "ambient";

export const sketch = (p5: P5CanvasInstance<Props>) => {
  p5.setup = () => {
    p5.createCanvas(1024, 1024);
    p5.background(p5.random(0, 255), p5.random(0, 255), p5.random(0, 255));
  };

  const loadImage = async (file: File): Promise<Image> => {
    const url = await toDataURL(file);
    return await new Promise<Image>((resolve, reject) => {
      p5.loadImage(url, (img) => {
        resolve(img);
      });
    });
  };

  p5.updateWithProps = async ({ colorMap, normalMap, ambientMap }) => {
    const [colorMapImage, normalMapImage, ambientMapImage] = await Promise.all(
      [colorMap, normalMap, ambientMap].map(loadImage)
    );

    const mixedImage = p5.createImage(1024, 1024);

    console.log("colorMapImage", colorMapImage);

    colorMapImage.loadPixels();
    normalMapImage.loadPixels();
    ambientMapImage.loadPixels();

    mixedImage.loadPixels();

    console.log(colorMapImage.pixels.length);

    const lightVec = p5.createVector(0, 0, 1);

    //rgbaで値が入るのでi += 4
    for (let i = 0; i < colorMapImage.pixels.length; i += 4) {
      const r = colorMapImage.pixels[i];
      const g = colorMapImage.pixels[i + 1];
      const b = colorMapImage.pixels[i + 2];
      const a = colorMapImage.pixels[i + 3];

      const normalX = normalMapImage.pixels[i];
      const normalY = normalMapImage.pixels[i + 1];
      const normalZ = normalMapImage.pixels[i + 2];

      const normalVec = p5.createVector(
        p5.map(normalX, 0, 255, -1, 1),
        p5.map(normalY, 0, 255, -1, 1),
        p5.map(normalZ, 0, 255, -1, 1)
      );

      const blight = p5.max(0, Vector.dot(lightVec, normalVec));

      //glTFではRがOcclusion、GがRoughness、BがMetallic
      const occlusion = p5.map(ambientMapImage.pixels[i], 0, 255, 0, 1);

      // const emissionRed = ambientMapImage.pixels[i];
      // const emissionGreen = ambientMapImage.pixels[i + 1];
      // const emissionBlue = ambientMapImage.pixels[i + 2];

      const emissionRed = 0;
      const emissionGreen = 0;
      const emissionBlue = 0;

      mixedImage.pixels[i] = p5.min(r * blight * occlusion + emissionRed, 255);
      mixedImage.pixels[i + 1] = p5.min(
        g * blight * occlusion + emissionGreen,
        255
      );
      mixedImage.pixels[i + 2] = p5.min(
        b * blight * occlusion + emissionBlue,
        255
      );
      mixedImage.pixels[i + 3] = a;
    }

    mixedImage.updatePixels();
    console.log("mixedImage", mixedImage.pixels);

    p5.background(0);
    p5.image(mixedImage, 0, 0, 1024, 1024);
  };

  p5.draw = () => {};
};

export const SketchContainer: FC<Props> = (props) => {
  return <ReactP5Wrapper sketch={sketch} {...props} />;
};
