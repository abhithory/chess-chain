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
    stackedAmount: {
        type: Number,
        required: [true, "There must be a staked amount"],
        default:0
    },
    matchJoinerAddress: {
        type: String,
        default:""
    },
    matchWinnerAddress: {
        type: String,
        default:""
    },
    rewardClaimed: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
})

const Match = mongoose.model("MatchDetails", matchSchema);
module.exports = Match;


