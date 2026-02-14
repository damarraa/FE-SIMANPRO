import defaultToolImg from "../assets/default-tool.png";

export const DEFAULT_TOOL_IMAGE = defaultToolImg;

export const getImageUrl = (path, defaultImage = "") => {
  if (!path) return defaultImage;

  if (typeof path !== "string") {
    console.warn(
      "getImageUrl mengharapkan string, menerima: ",
      typeof path,
      path
    );
    return defaultImage;
  }

  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }

  const base =
    import.meta.env.VITE_ASSET_BASE_URL || "https://be.simanpro.prisan.co.id";

  const cleanBase = base.replace(/\/+$/, "");
  let cleanPath = path.replace(/\/\/+/g, "/");

  if (cleanPath.startsWith("/storage/storage")) {
    cleanPath = cleanPath.replace("/storage/storage", "/storage");
  } else if (cleanPath.startsWith("storage/storage")) {
    cleanPath = cleanPath.replace("storage/storage", "storage");
  }

  if (!cleanPath.startsWith("/")) {
    cleanPath = `/${cleanPath}`;
  }

  return `${cleanBase}${cleanPath}`;
};
