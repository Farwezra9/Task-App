require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require("cors");
require("./config/db");
const app = express(); 

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const usersRoutes = require("./routes/users");
app.use("/api/users", usersRoutes);

const todosRoutes = require("./routes/todos");
app.use("/api/todos", todosRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server port ${PORT}`);
});
