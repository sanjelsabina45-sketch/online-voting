const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users",
    require("./route/userRoute"));

app.use("/api/elections",
    require("./route/electionRoutes"));

app.use("/api/candidates",
    require("./route/candidateRoutes"));

app.use("/api/votes",
    require("./route/voteRoutes"));

module.exports = app;