import express from 'express';
import UserController from './controllers/UserController';
import router from './routers/all';
import { sendMail } from './utils/an_mern_pack/mailing';
require('./db')
require("dotenv").config();

// const { apiRouter } = require('./api');

const app = express();
app.use(express.json());

// sendMail({
//     to: "a.nahji@yanvision.ma",
//     subject: "Hello",
//     body: "Hello world!"
//   }).catch(console.error);

app.get('/', (req, res) => {
    res.send("hello world");
})

app.use('/',router)

app.use('/static', express.static('uploads'))

app.listen(process.env.PORT, () => {
    console.log("URL : ", `http://localhost:${process.env.PORT}`);
})