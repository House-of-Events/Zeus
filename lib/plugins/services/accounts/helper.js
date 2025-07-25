export const checkIfAccountExists = async (email, db) => {
  try {
    const account = await db.select().where({ email });
    const exists = account.length > 0;
    return exists;
  } catch (error) {
    throw new Error(`Database error while checking account: ${error.message}`);
  }
};
