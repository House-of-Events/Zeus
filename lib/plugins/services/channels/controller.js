import { db } from "../../../../db/index.js";
import {
  createSuccessResponse,
  createErrorResponse,
  getHttpStatusForError,
} from "../../../errors/index.js";

export async function getChannels(request, h) {
  try {
    const channels = await db("sports_channels")
      .select("name", "id", "description", "is_active", "created_at")
      .orderBy("created_at", "desc");

    return h.response(createSuccessResponse(channels)).code(200);
  } catch (error) {
    const errorResponse = createErrorResponse("DATABASE_ERROR");
    const statusCode = getHttpStatusForError("DATABASE_ERROR");

    return h.response(errorResponse).code(statusCode);
  }
}
