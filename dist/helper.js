// src/helper.js

export const validateChannelId = async (id, db) => {
  const channel = await db.select().where({ id });
  if (!channel || channel.length === 0) {
    // Create a new error with detailed information
    const err = new Error("Channel does not exist");
    err.statusCode = 404; // Custom error code
    err.details = { id }; // Optionally, include the invalid ID for debugging
    throw err; // Throw the error
  }
};

export const getChannelName = async (id, db) => {
  try {
    const channel = await db.select("name").where({ id });
    return channel[0].name;
  } catch (error) {
    const err = new Error("Error getting channel name");
    err.statusCode = 500;
    err.details = { id };
    throw err;
  }
};
