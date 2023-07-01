const express = require("express");
const { createMatch, getMatchById } = require("../controller/matchController");

const matchRouter = express.Router();


matchRouter
    .route("/")
    .post(createMatch);

matchRouter
    .route("/:matchId")
    .get(getMatchById);



module.exports = matchRouter;