const users = [
  {
    email: "coba@gmail.com",
    password: "123456",
  },
  {
    email: "apa@gmail.com",
    password: "123456",
  },
];

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { isAuthenticated, verifyRefresh } = require("./helper");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.send("masuk bos");
});

app.post("/login", (req, res) => {
  //   console.log("ini hasil request >>>> ", req.body);
  const { email } = req.body;
  const findEmail = users.find((el) => el.email === email);
  if (!findEmail) {
    return res.status(400).json({ success: false, error: "email not found" });
  }
  if (!email) {
    return res.status(400).json({ success: false, error: "enter your email" });
  }
  const accessToken = jwt.sign({ email: email }, "accessSecret", {
    expiresIn: "2m",
  });
  const refreshToken = jwt.sign({ email: email }, "refreshSecret", {
    expiresIn: "5m",
  });

  return res.status(200).json({ email,accessToken, refreshToken });
});

app.get("/protected", isAuthenticated, (req, res) => {
  res.json({ success: true, msg: "Welcome user!!", email: req.email });
});

app.post("/refresh", (req, res) => {
  const { email, refreshToken } = req.body;
  const isValid = verifyRefresh(email, refreshToken);
  if (!isValid) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid token,try login again" });
  }
  const accessToken = jwt.sign({ email: email }, "accessSecret", {
    expiresIn: "2m",
  });
  return res.status(200).json({ success: true, accessToken });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
