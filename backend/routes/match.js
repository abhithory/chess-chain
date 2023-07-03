const express = require("express");
const { createMatch, getMatchById, joinMatch, setMatchWinner, rewardClaimed } = require("../controller/matchController");

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

matchRouter
    .route("/rewardClaimed")
    .patch(rewardClaimed);




module.exports = matchRouter;