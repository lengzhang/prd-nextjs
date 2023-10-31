export const getFileKey = (file: File) =>
  `${file.name}|${file.size}|${file.type}`;
