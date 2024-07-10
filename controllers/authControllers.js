
const checkMe = async (req, res) => {
    const { password } = req.body

    if (password === process.env.PASSWORD) {
        return res.status(200).json({ message: "Hello Altai" })
    } else {
        return res.status(400).json({ message: "Unauthorized" })
    }
}

module.exports = {
    checkMe
}

