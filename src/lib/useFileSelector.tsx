import { ChangeEvent, useCallback, useMemo, useState } from "react";
import { Select } from "@chakra-ui/react";
import { fileToKey } from "./fileToKey";

export type UseFileSelectResult = [
  selectedFile: File | undefined,
  renderSelector: () => JSX.Element
];

export const useFileSelector = (files: File[]): UseFileSelectResult => {
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setSelectedKey(e.target.value);
    },
    [setSelectedKey]
  );

  const selectedFile = useMemo(
    () => files.find((file) => fileToKey(file) === selectedKey),
    [files, selectedKey]
  );

  const renderSelector = () => {
    return (
      <Select
        value={selectedKey}
        onChange={handleSelectChange}
        placeholder="Select a file"
      >
        {files.map((file) => (
          <option key={fileToKey(file)} value={fileToKey(file)}>
            {file.name}
          </option>
        ))}
      </Select>
    );
  };

  return [selectedFile, renderSelector];
};
