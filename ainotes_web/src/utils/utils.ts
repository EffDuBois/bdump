export const getTitleFromPath = (path: string) => {
  return path.replace(/^.*[\\/]/, "");
};
