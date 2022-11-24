import { useQuery } from "react-query";

export const useFileReader = (file: File) => {
  const { data } = useQuery(
    `${file.name}:${file.size}:${file.lastModified}`,
    () => toDataURL(file),
    {
      suspense: true,
    }
  );

  const image = new Image();
  image.src = data!;

  return {
    url: data!,
    width: image.width,
    height: image.height,
  };
};

export const toDataURL = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (reader.result === null) {
        reject("No result");
        return;
      }
      resolve(reader.result.toString());
    });
    reader.addEventListener("error", (e) => {
      reject(e);
    });
    reader.readAsDataURL(file);
  });
