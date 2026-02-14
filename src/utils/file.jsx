export const getFileUrl = (path) => {
  if (!path) return "";
  const base =
    import.meta.env.VITE_ASSET_BASE_URL ||
    "https://v2.be.simanpro.prisan.co.id";
  return path.startsWith("http") ? path : `${base}${path}`;
};

export const openFileInNewTab = (path) => {
  const url = getFileUrl(path);
  if (url) window.open(url, "_blank");
};
