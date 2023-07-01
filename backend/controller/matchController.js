const Match = require("../model/matchModel");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");


exports.createMatch = catchAsync(async (req, res, next) => {
    const { matchId, matchCreatorAddress } = req.body;
    const _match = await Match.findById(matchId);

    if (_match) {
        return next(new AppError("Match already created with this id", 400));
    }
    const newMatch = await Match.create({ matchId, matchCreatorAddress });

    return res.status(200).send({ success: true, data: newMatch });
})

exports.getMatchById = catchAsync(async (req, res, next) => {
    const matchId = req.params.matchId;
    const match = await Match.findById(matchId);

    if (!match) {
        return next(new AppError("No Match found with that ID", 404));
    }
    return res.status(200).send({ success: true, data: match });
})