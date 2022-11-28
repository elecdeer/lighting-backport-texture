import { P5CanvasInstance, ReactP5Wrapper } from "react-p5-wrapper";
import { Image } from "p5";
import { FC } from "react";
import { toDataURL } from "./lib/useFileImage";

type Props = {
  color: {
    file: File;
  } | null;
  normal: {
    file: File;
    light: [x: number, y: number, z: number];
    scale: number;
  } | null;
  occlusion: {
    file: File;
    channel: "R" | "G" | "B";
    scale: number;
  } | null;
  emission: {
    file: File;
    scale: number;
  } | null;
};

type Blender = (
  pixelIndex: number,
  [r, g, b, a]: [number, number, number, number]
) => [r: number, g: number, b: number, a: number];

const textureSize = 2048;

const minMax = (min: number, max: number) => (value: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const minMax255 = minMax(0, 255);

export const sketch = (p5: P5CanvasInstance<Props>) => {
  p5.setup = () => {
    p5.createCanvas(textureSize, textureSize);
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

  const nopBlender: Blender = (_, rgba) => rgba;

  const simplify = (v: number) => minMax255(p5.round(v));
  const simplifyBlender: Blender = (_, rgba) => {
    return [
      simplify(rgba[0]),
      simplify(rgba[1]),
      simplify(rgba[2]),
      simplify(rgba[3]),
    ];
  };

  const createNormalBlender = async (
    normalProp: Props["normal"]
  ): Promise<Blender> => {
    if (!normalProp) return nopBlender;
    const { file, scale, light } = normalProp;

    const normalMapImage = await loadImage(file);
    normalMapImage.loadPixels();

    return (pixelIndex, rgba) => {
      const normalX = normalMapImage.pixels[pixelIndex * 4];
      const normalY = normalMapImage.pixels[pixelIndex * 4 + 1];
      const normalZ = normalMapImage.pixels[pixelIndex * 4 + 2];

      //内積
      const brightness = minMax(
        0,
        1
      )((normalX * light[0] + normalY * light[1] + normalZ * light[2]) / 255);

      const [r, g, b, a] = rgba;
      const [r2, g2, b2, a2] = [
        r * brightness,
        g * brightness,
        b * brightness,
        a,
      ];
      //bが0.8なら、もとが100のとき80になる -20
      return [
        r + (r2 - r) * scale,
        g + (g2 - g) * scale,
        b + (b2 - b) * scale,
        a2,
      ];
    };
  };

  const createOcclusionBlender = async (
    occlusionProp: Props["occlusion"]
  ): Promise<Blender> => {
    if (!occlusionProp) return nopBlender;
    const { file, scale, channel } = occlusionProp;

    const occlusionMapImage = await loadImage(file);
    occlusionMapImage.loadPixels();

    const channelIndex = channel === "R" ? 0 : channel === "G" ? 1 : 2;

    return (pixelIndex, rgba) => {
      const occlusion = occlusionMapImage.pixels[pixelIndex * 4 + channelIndex];
      const [r, g, b, a] = rgba;
      const [r2, g2, b2, a2] = [
        (r * occlusion) / 255,
        (g * occlusion) / 255,
        (b * occlusion) / 255,
        a,
      ];
      return [
        r + (r2 - r) * scale,
        g + (g2 - g) * scale,
        b + (b2 - b) * scale,
        a2,
      ];
    };
  };

  const createEmissionBlender = async (
    emissionProp: Props["emission"]
  ): Promise<Blender> => {
    if (!emissionProp) return nopBlender;
    const { file, scale } = emissionProp;

    const emissionMapImage = await loadImage(file);
    emissionMapImage.loadPixels();

    return (pixelIndex, rgba) => {
      const emissionR = emissionMapImage.pixels[pixelIndex * 4];
      const emissionG = emissionMapImage.pixels[pixelIndex * 4 + 1];
      const emissionB = emissionMapImage.pixels[pixelIndex * 4 + 2];

      const [r, g, b, a] = rgba;
      return [
        r + emissionR * scale,
        g + emissionG * scale,
        b + emissionB * scale,
        a,
      ];
    };
  };

  p5.updateWithProps = async (props) => {
    console.log("updateWithProps", props);
    const { color, normal, occlusion, emission } = props;
    p5.background(0);

    const colorImage = color
      ? await loadImage(color.file)
      : p5.createImage(textureSize, textureSize);

    const normalBlend = await createNormalBlender(normal);
    const occlusionBlend = await createOcclusionBlender(occlusion);
    const emissionBlend = await createEmissionBlender(emission);

    const mixedImage = p5.createImage(textureSize, textureSize);
    mixedImage.loadPixels();
    colorImage.loadPixels();

    //rgbaで値が入るのでi += 4
    for (let i = 0; i < mixedImage.pixels.length; i += 4) {
      const base: [number, number, number, number] = [
        colorImage.pixels[i],
        colorImage.pixels[i + 1],
        colorImage.pixels[i + 2],
        colorImage.pixels[i + 3],
      ];

      let rgba: [number, number, number, number] = [
        base[0],
        base[1],
        base[2],
        base[3],
      ];

      const pixelIndex = i / 4;
      rgba = normalBlend(pixelIndex, rgba);
      rgba = occlusionBlend(pixelIndex, rgba);
      rgba = emissionBlend(pixelIndex, rgba);

      // rgba = simplifyBlender(pixelIndex, rgba);

      mixedImage.pixels[i] = minMax255(rgba[0]);
      mixedImage.pixels[i + 1] = minMax255(rgba[1]);
      mixedImage.pixels[i + 2] = minMax255(rgba[2]);
      mixedImage.pixels[i + 3] = minMax255(rgba[3]);
    }

    mixedImage.updatePixels();
    console.log("mixedImage", mixedImage.pixels);

    p5.background(0, 0, 0);
    p5.image(mixedImage, 0, 0, textureSize, textureSize);
  };

  p5.draw = () => {};
};

export const SketchContainer: FC<Props> = (props) => {
  return <ReactP5Wrapper sketch={sketch} {...props} />;
};
