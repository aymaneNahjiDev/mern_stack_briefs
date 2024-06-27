"use strict";
const express = require('express');
require("dotenv").config();
// const { apiRouter } = require('./api');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send("hello world");
});
// app.use('/api',apiRouter)
app.use('/static', express.static('uploads'));
app.listen(process.env.PORT, () => {
    console.log("URL : ", `http://localhost:${process.env.PORT}`);
});
