const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

const cors = require("cors");
app.use(cors());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// TO DELETE

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
