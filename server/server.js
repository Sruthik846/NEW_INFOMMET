const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 5000;

// Configure CORS to allow requests from specific origins
const allowedOrigins = ["http://localhost:3000", "http://192.168.0.44:3000"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // If you're sending cookies
  })
);

app.use(express.json());
app.use(cookieParser());

app.post("/api/loginn", (req, res) => {
  const { tokens } = req.body;
  const { emailCookie } = req.body;
  const { passwordCookie } = req.body;
  const { ifidCookie } = req.body;
  const { deptCookie } = req.body;
  const { userTypeCookie } = req.body;
  const { nameCookie } = req.body;

  const expirationTime = 2 * 60 * 60 * 1000; // 5 minutes in milliseconds
  const expirationDate = new Date(Date.now() + expirationTime);
  res.cookie("authToken", tokens, {
    httpOnly: true,
    sameSite: "strict",
    expires: expirationDate,
  });

  res.cookie("email", emailCookie, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("password", passwordCookie, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("ifid", ifidCookie, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("department", deptCookie, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("usertype", userTypeCookie, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.cookie("name", nameCookie, {
    httpOnly: true,
    sameSite: "strict",
  });
  console.log(req.cookies.authToken);
  res.status(200).json({ success: true });
});

// For getting coie
app.get("/get-cookie-data", (req, res) => {
  const cookieValue = req.cookies.authToken; // Access the HTTP-only cookie
  const emailValue = req.cookies.email;
  const passwordValue = req.cookies.password;
  const ifidValue = req.cookies.ifid;
  const deptValue = req.cookies.department;
  const userValue = req.cookies.usertype;
  const nameValue = req.cookies.name;
  res.json({
    auth: cookieValue,
    email: emailValue,
    password: passwordValue,
    ifid: ifidValue,
    department: deptValue,
    usertype: userValue,
    name: nameValue,
  });
});

// Clear cookie
app.get("/clear-cookie", (req, res) => {
  console.log("Clear cookie");
  res.clearCookie("authToken", { httpOnly: true });
  res.clearCookie("email", { httpOnly: true });
  res.clearCookie("password", { httpOnly: true });
  res.clearCookie("ifid", { httpOnly: true });
  res.clearCookie("department", { httpOnly: true });
  res.clearCookie("usertype", { httpOnly: true });
  res.clearCookie("name", { httpOnly: true });
  res.send("HTTP-only cookie cleared");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
