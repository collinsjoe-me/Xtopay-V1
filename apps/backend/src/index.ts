// server.ts or index.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes";

dotenv.config();

const app = express();

// ✅ Define all allowed frontend domains (add localhost for dev if needed)
const allowedOrigins = [
  "https://pay.xtopay.co",
  "https://checkout.xtopay.com",
  "https://www.checkout.xtopay.co",
  "https://www.pay.xtopay.co",
  "", // allow no origin (e.g., Postman)
  "http://localhost:3000", // optional for dev
];

// ✅ Apply robust CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server or Postman
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS error: Origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

// ✅ Parse JSON requests
app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Xtopay Backend API is running.");
});

// ✅ Register API routes
app.use("/", routes);

// ✅ Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Xtopay API running on port ${PORT}`);
});
