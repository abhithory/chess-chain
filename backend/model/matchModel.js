const mongoose = require('mongoose');


const matchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: [true, "There must be a Match Id"],
        unique: true
    },
    matchCreatorAddress: {
        type: String,
        required: [true, "There must be a game creator"],
    },
    matchJoinerAddress: {
        type: String
    },
    matchWinnerAddress: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

const Match = mongoose.model("MatchDetails", matchSchema);
module.exports = Match;


