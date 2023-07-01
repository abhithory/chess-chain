const express = require("express");
const { createMatch, getMatchById, joinMatch, setMatchWinner } = require("../controller/matchController");

const matchRouter = express.Router();


matchRouter
    .route("/")
    .post(createMatch);

matchRouter
    .route("/:matchId")
    .get(getMatchById);

matchRouter
    .route("/joinmatch")
    .get(joinMatch);
matchRouter
    .route("/setmatchwinner")
    .get(setMatchWinner);




module.exports = matchRouter;