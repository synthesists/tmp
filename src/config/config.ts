import dotenv from "dotenv";

dotenv.config();

export default {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};
