const express = require('express');
const cors = require('cors');
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");

// express app
const app = express();

// configure express to use json as middle-ware
app.use(cors());
app.use(express.json({limit: '200mb'}));

app.use("/auth", authRouter);
app.use("/users", usersRouter);

// listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));