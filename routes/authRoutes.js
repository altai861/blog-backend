const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/authControllers")

router.route("/admin")
    .post(authControllers.logAdmin)

router.route("/")
    .post(authControllers.addUser)

module.exports = router;