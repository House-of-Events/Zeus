import { db } from "../../../../db/index.js";

export async function getChannels(request, h) {
  try {
    const channels = await db("sports_channels")
      .select("name", "id", "description", "is_active", "created_at")
      .orderBy("created_at", "desc");
    return h
      .response({
        status: "success",
        data: channels,
      })
      .code(200);
  } catch (error) {
    console.error("Error in getChannels:", error);
    return h
      .response({
        status: "error",
        message: "An unexpected error occurred",
        code: "SERVER_ERROR",
      })
      .code(500);
  }
}
