import { FC } from "react";
import { useDropzone } from "react-dropzone";
import { Center, CenterProps, Text } from "@chakra-ui/react";

type Props = {
  onFileSelected: (files: File[]) => void;
} & CenterProps;

export const Dropzone: FC<Props> = ({ onFileSelected, ...props }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: onFileSelected,
  });

  return (
    <Center
      p={4}
      border="1px"
      borderColor={"teal.400"}
      borderRadius={4}
      cursor={"pointer"}
      bgColor={isDragActive ? "teal.400" : "transparent"}
      {...props}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <Text as={"b"} color={isDragActive ? "white" : "teal.400"}>
        {isDragActive ? "Drop the files here" : "Drag 'n' drop some files here"}
      </Text>
    </Center>
  );
};
