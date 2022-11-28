import { Select } from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";

export type UseSelectorResult<T> = [value: T, renderSelect: () => JSX.Element];

export const useSelector = <T extends string>(
  options: T[]
): UseSelectorResult<T> => {
  const [value, setValue] = useState<T>(options[0]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value as T);
  };

  const renderSelect = () => {
    return (
      <Select value={value} onChange={handleChange}>
        {options.map((option, i) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  };

  return [value, renderSelect];
};
