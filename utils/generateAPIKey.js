export const generateAPIKey = async (request, h) => {
  const apiKey = `live_${Math.random().toString(36).substr(2, 10)}`;
  return apiKey;
};
