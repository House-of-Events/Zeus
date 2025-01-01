const { v4: uuidv4 } = require("uuid");

function generateUniqueId(prefix, length = 10) {
  const shortUuid = uuidv4().replace(/-/g, "").substr(0, length);
  return `${prefix}${shortUuid}`;
}

module.exports = {
  generateUserId: () => generateUniqueId("user_"),
  generateRecordId: () => generateUniqueId("rec_"),
};
