import { v4 as uuidv4 } from "uuid";

export const generateUniqueId = (prefix, length = 10) => {
  const shortUuid = uuidv4().replace(/-/g, "").substr(0, length);
  return `${prefix}${shortUuid}`;
};
