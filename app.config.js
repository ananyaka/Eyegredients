import "dotenv/config";

export default {
  name: "EyeGredients",
  version: "1.0.0",
  extra: {
    chompApiKey: process.env.CHOMP_API_KEY,
  },
};
