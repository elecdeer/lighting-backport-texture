import { useState } from "react";
import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Tooltip,
} from "@chakra-ui/react";

export type UseSliderResult = [value: number, renderSlider: () => JSX.Element];

export const useSlider = (
  defaultValue: number,
  min: number,
  max: number
): UseSliderResult => {
  const [value, setValue] = useState(defaultValue);
  const [showTooltip, setShowTooltip] = useState(false);

  const renderSlider = (): JSX.Element => {
    return (
      <Slider
        id={"slider"}
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={5}
        colorScheme="teal"
        onChange={setValue}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <SliderMark value={min} mt="1" ml="-2.5" fontSize="sm">
          {min}%
        </SliderMark>
        <SliderMark value={defaultValue} mt="1" ml="-2.5" fontSize="sm">
          {defaultValue}%
        </SliderMark>
        <SliderMark value={max} mt="1" ml="-2.5" fontSize="sm">
          {max}%
        </SliderMark>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <Tooltip
          hasArrow
          bg="teal.500"
          color="white"
          placement="top"
          isOpen={showTooltip}
          label={`x ${value}%`}
        >
          <SliderThumb />
        </Tooltip>
      </Slider>
    );
  };

  return [value, renderSlider];
};
