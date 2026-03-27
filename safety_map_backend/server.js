require("dotenv").config();
console.log("ENV CHECK:", {
  PORT:       process.env.PORT,
  MONGO_URI:  process.env.MONGO_URI ? "✅ set" : "❌ MISSING",
  JWT_SECRET: process.env.JWT_SECRET ? "✅ set" : "❌ MISSING",
});

const app = require("./src/app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 SafeMap server running on http://localhost:${PORT}`);
});