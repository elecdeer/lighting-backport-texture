import { ChangeEventHandler, FC, useCallback, useMemo, useState } from "react";
import { SketchContainer } from "./Sketch";
import {
  Box,
  HStack,
  InputGroup,
  InputGroupProps,
  InputLeftAddon,
  Select,
  VStack,
} from "@chakra-ui/react";
import { Dropzone } from "./Dropzone";
import { TextureCard } from "./TextureCard";
import { fileToKey } from "./lib/fileToKey";

function App() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileSelected = useCallback((files: File[]) => {
    console.log(files);
    setFiles((prev) => [...prev, ...files]);
  }, []);

  const [colorMap, setColorMap] = useState<File | null>(null);
  const [normalMap, setNormalMap] = useState<File | null>(null);
  const [ambientMap, setAmbientMap] = useState<File | null>(null);

  const handleColorMapChange = useCallback(
    (key: string) => {
      setColorMap(files.find((file) => fileToKey(file) === key) ?? null);
    },
    [files]
  );

  const handleNormalMapChange = useCallback(
    (key: string) => {
      setNormalMap(files.find((file) => fileToKey(file) === key) ?? null);
    },
    [files]
  );

  const handleAmbientMapChange = useCallback(
    (key: string) => {
      setAmbientMap(files.find((file) => fileToKey(file) === key) ?? null);
    },
    [files]
  );

  const fulfilled =
    colorMap !== null && normalMap !== null && ambientMap !== null;

  return (
    <VStack>
      <HStack>
        <Dropzone width={"400px"} onFileSelected={handleFileSelected} />
      </HStack>
      <VStack>
        {files.map((file, i) => {
          const handleClickDelete = () => {
            setFiles((prev) => prev.filter((_, j) => i !== j));
          };

          return (
            <TextureCard
              file={file}
              key={`${file.name}:${file.size}`}
              onClickDelete={handleClickDelete}
            />
          );
        })}
      </VStack>

      <VStack>
        <MapTypeSelect
          label={"Color"}
          files={files}
          selectedKey={""}
          onChangeKey={handleColorMapChange}
        />
        <MapTypeSelect
          label={"Normal"}
          files={files}
          selectedKey={""}
          onChangeKey={handleNormalMapChange}
        />
        <MapTypeSelect
          label={"Ambient"}
          files={files}
          selectedKey={""}
          onChangeKey={handleAmbientMapChange}
        />
      </VStack>

      <Box>
        {fulfilled && (
          <SketchContainer
            colorMap={colorMap}
            normalMap={normalMap}
            ambientMap={ambientMap}
          />
        )}
      </Box>
    </VStack>
  );
}

const MapTypeSelect: FC<
  {
    label: string;
    files: File[];
    selectedKey: string;
    onChangeKey: (key: string) => void;
  } & InputGroupProps
> = ({ label, files, selectedKey, onChangeKey, ...props }) => {
  const keys = useMemo(() => files.map((file) => fileToKey(file)), [files]);

  const handleChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      onChangeKey(e.target.value);
    },
    [onChangeKey]
  );

  return (
    <InputGroup {...props}>
      <InputLeftAddon>{label}</InputLeftAddon>
      <Select placeholder={"Select file..."} onChange={handleChange}>
        {files.map((file, i) => {
          const key = keys[i];
          return (
            <option key={key} value={key}>
              {file.name}
            </option>
          );
        })}
      </Select>
    </InputGroup>
  );
};

export default App;
