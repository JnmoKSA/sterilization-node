require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Electronic Sterilization Tracking System - Demo Running");
});

app.get("/dashboard", (req, res) => {
  res.json({
    instrumentsReceived: 120,
    sterilized: 118,
    failedCycles: 2,
    region: "Gulf Region"
  });
});

app.get("/cycles", (req, res) => {
  res.json([
    { id: 1, sterilizer: "STEAM 1", status: "PASSED" },
    { id: 2, sterilizer: "STEAM 2", status: "FAILED" }
  ]);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
