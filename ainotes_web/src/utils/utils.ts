export const getTitleFromPath = (path: string | undefined) => {
  return path?.replace(/^.*[\\/]/, "");
};
