const jwt = require('jsonwebtoken');
const User = require('../models/userSchema'); // Import your User model here


const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(400).json({ message: "Missing Token..." });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.find({ _id: decode.userId });

        if (!user) {
            return res.status(400).json({ message: "User Not Found..." });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid Token..." });
    }
};

module.exports = {verifyToken};