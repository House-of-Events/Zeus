const Zeus = require("./server");
const startServer = async () => {
  try {
    const server = await Zeus.configureServer();
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.error("Error starting server:", error);
    throw error;
  }
};

startServer();
