
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 5000;
const cookie = require("js-cookie");

// Configure CORS to allow requests from specific origins
const allowedOrigins = ["http://localhost:3000", "http://192.168.0.44:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true // If you're sending cookies
  })
);

app.use(express.json());
app.use(cookieParser());


app.post("/api/loginn", (req, res) => {
  const { tokens } = req.body;
  const expirationTime = 2 * 60 * 60 * 1000; // 5 minutes in milliseconds
  const expirationDate = new Date(Date.now() + expirationTime);
  res.cookie("authToken", tokens, {
    httpOnly: true,
    sameSite: "strict",
    expires: expirationDate,
  });
  res.status(200).json({ success: true });
});

// For getting coie
app.get("/get-cookie-data", (req, res) => {
  const cookieValue = req.cookies.authToken; // Access the HTTP-only cookie
  // console.log(cookieValue);
  res.json({ auth: cookieValue });
});

// Clear cookie
app.get("/clear-cookie", (req, res) => {
  console.log("Clear cookie");
  res.clearCookie("authToken", { httpOnly: true });
  console.log("cookie deleted");
  res.send("HTTP-only cookie cleared");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
