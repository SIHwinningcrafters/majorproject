require("dotenv").config();
const express   = require("express");
const cors      = require("cors");
const connectDB = require("./config/db");

const authRoutes     = require("./routes/auth.routes");
const incidentRoutes = require("./routes/incident.routes");

const app = express();

/* ── connect to MongoDB ── */
connectDB();

/* ── middleware ── */
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:5173",
//   credentials: true,
// }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* ── routes ── */
app.use("/api/auth",      authRoutes);
app.use("/api/incidents", incidentRoutes);

/* ── health check ── */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SafeMap API is running 🗺️" });
});

/* ── 404 ── */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ── global error handler (must have exactly 4 params) ── */
app.use((err, req, res, next) => {   // eslint-disable-line no-unused-vars
  console.error("GLOBAL ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;

// require("dotenv").config();
// const express    = require("express");
// const cors       = require("cors");
// const connectDB  = require("./config/db");

// const authRoutes     = require("./routes/auth.routes");
// const incidentRoutes = require("./routes/incident.routes");

// const app = express();

// /* ── connect to MongoDB ── */
// connectDB();

// /* ── middleware ── */

// // app.use(cors());

// // app.use(cors({
// //   origin: process.env.CLIENT_URL || "http://localhost:5173" || "http://localhost:3000",
// //   credentials: true,
// // }));

// app.use(cors({
//   origin: true,
//   credentials: true,
// }));

// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// /* ── routes ── */
// app.use("/api/auth",      authRoutes);
// app.use("/api/incidents", incidentRoutes);

// /* ── health check ── */
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", message: "SafeMap API is running 🗺️" });
// });

// /* ── 404 handler ── */
// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

// /* ── global error handler ── */
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     message: err.message || "Internal server error",
//   });
// });

// ///neww
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// //neww

// module.exports = app;