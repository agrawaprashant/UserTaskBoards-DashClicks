const express = require("express");
const connectDb = require("./db/db");
const app = express();

//connect database
connectDb();
app.get("/", (req, res) => {
  res.send("API is running!");
});

//Init Middleware
app.use(express.json({ extended: false }));
//Set Headers

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,x-auth-token,Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

//define routes
app.get("/", async (req, res) => {
  console.log("API is running!");
});
app.use("/api/user", require("./routes/api/Users"));
app.use("/api/task", require("./routes/api/Tasks"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});