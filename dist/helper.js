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

export const validateIfAlreadySubscribed = async (user_id, channel_id, db) => {
  const subscription = await db.select().where({ user_id, channel_id });
  if (subscription && subscription.length > 0) {
    const err = new Error("User is already subscribed to this channel");
    err.statusCode = 400;
    err.details = { user_id, channel_id };
    throw err;
  }
};

export const checkIfAccountExists = async (email, db) => {
  console.log("Checking if account exists:", email);
  try {
    const account = await db.select().where({ email });
    const exists = account.length > 0;
    console.log(exists ? "Account exists:" : "Account does not exist:", email);
    return exists;
  } catch (error) {
    console.error("Error checking if account exists:", error);
    throw new Error(`Database error while checking account: ${error.message}`);
  }
};
