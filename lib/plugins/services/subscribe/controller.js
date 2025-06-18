import knexConfig from "../../../../knexfile.js";
import knex from "knex";
import { generateUniqueId } from "../../../../utils/_idGenerator.js";
import {
  getChannelName,
  sendMessageToSubscribeUsersChannel,
  sendMessageToUnsubscribeUsersChannel,
  validateChannelId,
  validateIfAlreadySubscribed,
} from "./helper.js";

const environment = process.env.NODE_ENV || "development";
const config = knexConfig[environment];
const database = knex(config);

export const subscribeToAll = async (request, h) => {
  if (!request.auth.credentials || !request.auth.credentials.id) {
    return h.response({ message: "User not authenticated" }).code(401);
  }
  const user_id = request.auth.credentials.id;
  let channels;
  try {
    channels = await database("channels")
      .select("id", "name")
      .where("is_active", true);
  } catch (error) {
    console.error("Error getting all channels:", error);
    return h.response({ message: "Error getting all channels" }).code(500);
  }

  const subscriptions = database("subscriptions");
  const allSubscriptions = [];

  try {
    for (const channel of channels) {
      const subscriptionId = await generateUniqueId("sub_");
      const subscription = await subscriptions
        .insert({
          id: subscriptionId,
          user_id,
          channel_id: channel.id,
          channel_name: channel.name,
          is_active: true,
        })
        .returning("*");
      allSubscriptions.push(subscription);
    }
  } catch (error) {
    console.error("Error inserting subscriptions:", error);
    return h
      .response({
        message: "Error inserting subscriptions - user is already subscrbibed",
      })
      .code(500);
  }

  return h.response(allSubscriptions).code(201);
};

export const subscibeChannel = async (request, h) => {
  if (!request.auth.credentials || !request.auth.credentials.id) {
    return h.response({ message: "User not authenticated" }).code(401);
  }
  const user_id = request.auth.credentials.id;
  const channel_id = request.params.id;
  const channelsModel = database("channels");
  const subscriptionsModel = database("subscriptions");
  try {
    //check if channel exists
    try {
      await validateChannelId(request.params.id, channelsModel);
    } catch (error) {
      return h
        .response({
          status: "error",
          message: "Channel does not exist",
          code: "CHANNEL_NOT_FOUND",
        })
        .code(404);
    }
    //check if user is already subscribed to the channel
    try {
      const accountSubscribed = await validateIfAlreadySubscribed(
        user_id,
        channel_id,
        subscriptionsModel,
      );
      if (accountSubscribed) {
        return h
          .response({
            status: "error",
            message: "Account already subscribed",
            code: "ACCOUNT_SUBSCRIBED",
          })
          .code(409);
      }
    } catch (error) {
      return h
        .response({
          status: "error",
          message: "Error verifying if account has already subscribed",
          code: "DATABASE_ERROR",
        })
        .code(500);
    }

    // subscribe user to channel
    const channel_name = await getChannelName(request.params.id, channelsModel);
    const subscriptionId = await generateUniqueId("sub_");
    const subscription = await database("subscriptions")
      .insert({
        id: subscriptionId,
        user_id,
        channel_id: request.params.id,
        channel_name,
        is_active: true,
      })
      .returning("*");

    await sendMessageToSubscribeUsersChannel(
      request.auth.credentials.email,
      channel_name,
    );

    return h
      .response({
        status: "success",
        message: "User subscribed to channel",
        data: subscription,
      })
      .code(201);
  } catch (error) {
    // Log the error for debugging
    console.error("Error:", error);
    // Respond with the error message and status code
    const statusCode = error.statusCode || 500;
    return h
      .response({
        message: error.message,
        details: error.details || "No additional details",
      })
      .code(statusCode);
  }
};

export const unsubscribeChannel = async (request, h) => {
  if (!request.auth.credentials || !request.auth.credentials.id) {
    return h.response({ message: "User not authenticated" }).code(401);
  }
  const user_id = request.auth.credentials.id;
  const channelsModel = database("channels");

  await validateChannelId(request.params.id, channelsModel);
  const channel_name = await getChannelName(
    request.params.id,
    database("channels"),
  );
  try {
    await sendMessageToUnsubscribeUsersChannel(
      request.auth.credentials.email,
      channel_name,
    );
  } catch (error) {
    console.error("Error sending message to unsubscribe users channel:", error);
    throw error;
  }
};
