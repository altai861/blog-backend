const User = require("../models/User");
const bcrypt = require("bcrypt");

const logAdmin = async (req, res) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ username }).exec();

    if (!foundUser) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (username !== "altai") {
        return res.status(401).json({ message: "You are not Altai, damnnn" });
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: "Password is not correct" });

    res.json({foundUser})
}

const addUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: "Information not enough" });
    }

    const foundUser = await User.findOne({ username }).exec();

    if (foundUser) {
        return res.status(409).json({ message: "Duplicate username" })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const newUser = new User({
        username, 
        email,
        password: passwordHash,
    })
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
}

module.exports = {
    logAdmin,
    addUser
}