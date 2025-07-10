import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
dotenv.config();

const slack_channel_id = process.env.SOCCER_PL_2024_SLACK_CHANNEL_ID;
const subscribe_users_channel_id = process.env.SUBSCRIBE_USERS_SLACK_CHANNEL_ID;
const slack_client = new WebClient(process.env.SLACK_BOT_TOKEN);
const unsubscribe_users_channel_id =
  process.env.UNSUBSCRIBE_USERS_SLACK_CHANNEL_ID;

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

export const validateIfAlreadySubscribed = async (user_id, channel_id, db) => {
  const subscription = await db.select().where({ user_id, channel_id });
  const exists = subscription.length > 0;
  return exists;
};

export const getSportsType = async (id, db) => {
  try {
    const channel = await db.select("sport_type").where({ id });
    return channel[0].sport_type;
  } catch (error) {
    const err = new Error("Error getting channel name");
    err.statusCode = 500;
    err.details = { id };
    throw err;
  }
};

export const sendMessageToSubscribeUsersChannel = async (email, sport_type) => {
  const message = `📢 *New Subscription Request*  
  📧 *Email:* ${email}  
  🔗 *Channel ID:* ${sport_type}  
  ✅ Please review and approve the request.`;
  const slackMessage = {
    channel: subscribe_users_channel_id,
    text: message,
  };

  try {
    const response = await slack_client.chat.postMessage(slackMessage);
    return response;
  } catch (error) {
    console.error("Error sending message to Slack channel", error);
    throw error;
  }
};

export const sendMessageToUnsubscribeUsersChannel = async (
  email,
  channel_id,
) => {
  const message = `📢 *New Unsubscription Request*  
  📧 *Email:* ${email}  
  🔗 *Channel ID:* ${channel_id}  
  ✅ Please review and unsubscribe the request.`;
  const slackMessage = {
    channel: unsubscribe_users_channel_id,
    text: message,
  };

  try {
    const response = await slack_client.chat.postMessage(slackMessage);
    return response;
  } catch (error) {
    console.error("Error sending message to Slack channel", error);
    throw error;
  }
};
