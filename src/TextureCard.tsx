import { FC, Suspense } from "react";
import { useFileReader } from "./lib/useFileImage";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";

type Props = {
  file: File;
  onClickDelete: () => void;
};

export const TextureCard: FC<Props> = (props) => {
  return (
    <Card direction={"row"} p={2} w={"400px"}>
      <Suspense fallback={<Spinner />}>
        <TextureCardContent {...props} />
      </Suspense>
    </Card>
  );
};

export const TextureCardContent: FC<Props> = ({ file, onClickDelete }) => {
  const { url, width, height } = useFileReader(file);

  return (
    <>
      <Image src={url} objectFit={"cover"} maxH={"120px"} />
      <Stack gap={1} w={"full"}>
        <CardHeader p={2}>
          <Heading size={"sm"}>{file.name}</Heading>
        </CardHeader>
        <CardBody p={2}>
          <Text>{`${width} x ${height}`}</Text>
        </CardBody>
        <CardFooter p={2}>
          <Button onClick={onClickDelete}>Delete</Button>
        </CardFooter>
      </Stack>
    </>
  );
};
