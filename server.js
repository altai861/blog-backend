require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = 3500;
const { logger } = require("./middlewares/logger")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")
const corsOptions = require("./config/corsOptions.js")

connectDB();

app.use(cors());
app.use(logger);
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', express.static(path.join(__dirname, '/public')));


app.use("/", require("./routes/root.js"))
app.use("/blog", require("./routes/blogRoutes.js"));
app.use("/auth", require("./routes/authRoutes.js"))

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ "error": '404 not found' })
    } else {
        res.type('txt').send("404 not found");
    }
})

mongoose.connection.once('open', ()=> {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`Server running on port ${port}`));
})


