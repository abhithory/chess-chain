const express = require("express");
const { createMatch, getMatchById, joinMatch, setMatchWinner } = require("../controller/matchController");

const matchRouter = express.Router();


matchRouter
    .route("/create")
    .post(createMatch);

matchRouter
    .route("/:matchId")
    .get(getMatchById);

matchRouter
    .route("/joinmatch")
    .patch(joinMatch);
    
matchRouter
    .route("/setmatchwinner")
    .patch(setMatchWinner);




module.exports = matchRouter;