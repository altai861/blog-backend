const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers")

router.route("/checkme")
    .post(authControllers.checkMe)

module.exports = router