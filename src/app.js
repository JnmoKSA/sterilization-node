require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { authMiddleware, requireRole, loginHandler, meHandler } = require("./auth");

const app = express();
app.use(cors());              // لاحقًا نقيد الدومين
app.use(express.json());

// Health
app.get("/", (req, res) => res.send("API Running"));

// Auth
app.post("/auth/login", loginHandler);
app.get("/auth/me", authMiddleware, meHandler);

// مثال بيانات محمية
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    instrumentsReceived: 120,
    sterilized: 118,
    failedCycles: 2,
    region: "Gulf Region",
    role: req.user.role
  });
});

app.get("/cycles", authMiddleware, (req, res) => {
  res.json([
    { id: 1, sterilizer: "STEAM 1", status: "PASSED" },
    { id: 2, sterilizer: "STEAM 2", status: "FAILED" }
  ]);
});

// مثال صلاحيات: admin فقط
app.get("/admin/users", authMiddleware, requireRole("admin"), (req, res) => {
  res.json([{ username: "admin", role: "admin" }]);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
