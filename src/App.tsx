import { useCallback, useState } from "react";
import { Box, Grid, GridItem, HStack, VStack } from "@chakra-ui/react";
import { Dropzone } from "./Dropzone";
import { TextureCard } from "./TextureCard";
import { useFileSelector } from "./lib/useFileSelector";
import { useSlider } from "./lib/useSlider";
import { useSelector } from "./lib/useSelector";
import { SketchContainer } from "./Sketch";

function App() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilePushed = useCallback((files: File[]) => {
    console.log(files);
    setFiles((prev) => [...prev, ...files]);
  }, []);

  const [colorMap, renderColorMapSelector] = useFileSelector(files);
  const [normalMap, renderNormalMapSelector] = useFileSelector(files);
  const [occlusionMap, renderOcclusionMapSelector] = useFileSelector(files);
  const [emissionMap, renderEmissionMapSelector] = useFileSelector(files);

  const [colorMapChannel, renderColorChannelSelector] = useSelector([
    "RGB",
    "None",
  ]);
  const [normalMapChannel, renderNormalChannelSelector] = useSelector([
    "RGB",
    "None",
  ]);
  const [occlusionMapChannel, renderOcclusionChannelSelector] = useSelector([
    "R",
    "G",
    "B",
    "None",
  ]);
  const [emissionMapChannel, renderEmissionChannelSelector] = useSelector([
    "RGB",
    "None",
  ]);

  const [normalScale, renderNormalScale] = useSlider(100, 0, 400);
  const [occlusionScale, renderOcclusionScale] = useSlider(100, 0, 400);
  const [emissionScale, renderEmissionScale] = useSlider(100, 0, 200);

  return (
    <VStack w={"full"}>
      <HStack>
        <Dropzone width={"400px"} onFileSelected={handleFilePushed} />
      </HStack>
      <VStack w={"full"}>
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

      <VStack w={"full"} px={4}>
        <Grid templateColumns={"repeat(6, 1fr)"} w={"full"} gap={2}>
          <GridItem>Color</GridItem>
          <GridItem colSpan={2}>{renderColorMapSelector()}</GridItem>
          <GridItem>{renderColorChannelSelector()}</GridItem>
          <GridItem colSpan={1} />
          <GridItem colSpan={1}></GridItem>
        </Grid>
        <Grid templateColumns={"repeat(6, 1fr)"} w={"full"} gap={2}>
          <GridItem>Normal</GridItem>
          <GridItem colSpan={2}>{renderNormalMapSelector()}</GridItem>
          <GridItem>{renderNormalChannelSelector()}</GridItem>
          <GridItem colSpan={1} px={2}>
            {renderNormalScale()}
          </GridItem>
        </Grid>
        <Grid templateColumns={"repeat(6, 1fr)"} w={"full"} gap={2}>
          <GridItem>Occlusion</GridItem>
          <GridItem colSpan={2}>{renderOcclusionMapSelector()}</GridItem>
          <GridItem>{renderOcclusionChannelSelector()}</GridItem>
          <GridItem colSpan={1} px={2}>
            {renderOcclusionScale()}
          </GridItem>
        </Grid>
        <Grid templateColumns={"repeat(6, 1fr)"} w={"full"} gap={2}>
          <GridItem>Emission</GridItem>
          <GridItem colSpan={2}>{renderEmissionMapSelector()}</GridItem>
          <GridItem>{renderEmissionChannelSelector()}</GridItem>
          <GridItem colSpan={1} px={2}>
            {renderEmissionScale()}
          </GridItem>
        </Grid>
      </VStack>

      <Box>
        <SketchContainer
          color={
            colorMap && colorMapChannel === "RGB"
              ? {
                  file: colorMap,
                }
              : null
          }
          normal={
            normalMap && normalMapChannel === "RGB"
              ? {
                  file: normalMap,
                  scale: normalScale / 100,
                  light: [0, 0, 1],
                }
              : null
          }
          occlusion={
            occlusionMap && occlusionMapChannel !== "None"
              ? {
                  file: occlusionMap,
                  scale: occlusionScale / 100,
                  channel: occlusionMapChannel,
                }
              : null
          }
          emission={
            emissionMap && emissionMapChannel === "RGB"
              ? {
                  file: emissionMap,
                  scale: emissionScale / 100,
                }
              : null
          }
        />
      </Box>
    </VStack>
  );
}

export default App;
