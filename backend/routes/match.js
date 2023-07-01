const express = require("express");
const { createMatch, getMatchById } = require("../controller/matchController");

const matchRouter = express.Router();


matchRouter
    .route("/")
    .post(createMatch);

matchRouter
    .route("/:id")
    .get(getMatchById);



module.exports = matchRouter;