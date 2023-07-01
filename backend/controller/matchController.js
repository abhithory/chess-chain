const Match = require("../model/matchModel");


exports.createMatch = async (req, res) => {
    const { matchId, matchCreatorAddress } = req.body;
    try {
        const _match = await Match.findById(matchId);

        if (_match) {
            throw Error("already match created with this id");
        }
        const newMatch = await Match.create({ matchId, matchCreatorAddress });

        return res.status(200).send({ success: true, data: newMatch });
    } catch (error) {
        return res.status(400).send({ success: true, message: error.message });
    }
}

exports.getMatchById = (req, res) => {
    res.send('Hello, World!');
}