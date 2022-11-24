export const fileToKey = (file: File): string => {
  return `${file.name}:${file.size}:${file.lastModified}`;
};
