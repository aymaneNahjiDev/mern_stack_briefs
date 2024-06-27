"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const { getPosts, getUsers } = require('./services');
const fs = require('fs');
const { upload } = require('./multer.config');
const apiRouter = express.Router();
apiRouter.post('/files', upload.single('avatar'), function (req, res) {
    res.send('File uploaded successfully');
});
apiRouter.get('/users', (req, res) => {
    getUsers()
        .then((response) => {
        res.status(200).send(response.data.slice(0, 10));
    })
        .catch((error) => {
        res.status(400).send('Not Found');
    });
});
apiRouter.get('/users/:id/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    getPosts()
        .then((response) => {
        res.status(200).send(response.data.filter(post => post.userId == id));
    })
        .catch((error) => {
        res.status(400).send('Not Found');
    });
}));
apiRouter.get('/load-posts', (req, res) => {
    return getPosts()
        .then((response) => {
        const posts = response.data.slice(0, 10);
        fs.writeFile('./data.json', JSON.stringify(posts), (error) => {
            if (error) {
                res.status(400).send('Not Found');
            }
            return res.status(200).send(`Success loading we have ${posts.length} posts`);
        });
    })
        .catch((error) => {
        return res.status(400).send('Not Found');
    });
});
apiRouter.get('/posts', (req, res) => {
    fs.readFile('./data.json', (error, data) => {
        if (error) {
            return res.status(400).send('Not Found');
        }
        return res.send(JSON.parse(data));
    });
});
apiRouter.get('/posts/:id', (req, res) => {
    fs.readFile('./data.json', (error, data) => {
        if (error) {
            return res.status(400).send('Not Found');
        }
        const posts = JSON.parse(data);
        return res.send(posts.find(post => post.id == req.params.id));
    });
});
module.exports = { apiRouter };
