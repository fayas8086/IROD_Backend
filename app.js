const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const userRouter = require("./routes/user");

app.use(express.json());

// CORS Permission
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS,GET,POST,PUT,PATCH,DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type",
        "Authorization"
    );
    next();
});

// ENV Path
dotenv.config({ path: "./config/.env" });

app.use("/", userRouter);

mongoose
    .connect(process.env.MONGO_URI)
    .then((result) => {
        app.listen(process.env.PORT, (req, res, next) => {
            console.log(`Server is Running at PORT ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
