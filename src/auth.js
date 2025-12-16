const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_ME";

// مستخدمون للعرض (لاحقًا نستبدلهم بقاعدة بيانات)
const users = [
  { id: 1, username: "admin",     role: "admin",     orgId: 1, passwordHash: bcrypt.hashSync("Admin@123", 10) },
  { id: 2, username: "manager",   role: "manager",   orgId: 1, passwordHash: bcrypt.hashSync("Manager@123", 10) },
  { id: 3, username: "supervisor",role: "supervisor",orgId: 1, passwordHash: bcrypt.hashSync("Supervisor@123", 10) },
  { id: 4, username: "tech",      role: "technician",orgId: 1, passwordHash: bcrypt.hashSync("Tech@123", 10) },
];

function signToken(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role, orgId: user.orgId },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

function loginHandler(req, res) {
  const { username, password } = req.body || {};
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = bcrypt.compareSync(password || "", user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user);
  return res.json({
    token,
    user: { id: user.id, username: user.username, role: user.role, orgId: user.orgId }
  });
}

function meHandler(req, res) {
  return res.json({ user: req.user });
}

module.exports = { authMiddleware, requireRole, loginHandler, meHandler };
