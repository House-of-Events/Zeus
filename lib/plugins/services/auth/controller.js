const bcrypt = require("bcryptjs");
const knexLib = require("knex");
const knexConfig = require("../../../../knexfile");

const knex = knexLib(knexConfig.development);

const authenticate = async (email, password) => {
  try {
    const query = knex("users").where({ email }).first();
    console.log("Executing query:", query.toString());
    const user = await query;
    if (!user) {
      return { isValid: false, credentials: null };
    }
    const isValid = await bcrypt.compare(password, user.password);
    const credentials = { id: user.id, name: user.name, email: user.email };
    return { isValid, credentials };
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw new Error("Database error");
  }
};

exports.loginHandler = async (request, h) => {
  const { email, password } = request.payload;
  console.log(email, password);
  const { isValid, credentials } = await authenticate(email, password);

  if (!isValid) {
    return h.response({ message: "Invalid email or password" }).code(401);
  }
  console.log("Setting cookie:", credentials.id);

  request.cookieAuth.set({ id: credentials.id });
  return h.response(credentials).code(200);
};

exports.profileHandler = async (request, h) => {
  return h.response({ user: request.auth.credentials }).code(200);
};
