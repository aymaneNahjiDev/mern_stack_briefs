import { upload } from "./multer.config";
import { getPosts, getUsers } from "./services";

import express from "express";
import fs from "fs"
import { Post } from "./typing";
const apiRouter = express.Router()


apiRouter.post('/files', upload.single('avatar'), function (req, res) {

    res.send('File uploaded successfully')
})

apiRouter.get('/users', (req, res) => {
    getUsers()
        .then((response) => {
            res.status(200).send(response.data.slice(0, 10))
        })
        .catch((error) => {
            res.status(400).send('Not Found')
        })
})

apiRouter.get('/users/:id/posts', async (req, res) => {
    const { id } = req.params
    
    if (typeof id !== 'number') return res.status(400).send('Not Found');
    getPosts()
        .then((response) => {
            res.status(200).send(response.data.filter(post => post.userId == id))
        })
        .catch((error) => {
            res.status(400).send('Not Found')
        })
})

apiRouter.get('/load-posts', (req, res) => {
    return getPosts()
        .then((response) => {
            const posts = response.data.slice(0, 10)
            fs.writeFile('./data.json', JSON.stringify(posts), (error) => {
                if (error) {
                    res.status(400).send('Not Found')
                }
                return res.status(200).send(`Success loading we have ${posts.length} posts`)
            })

        })
        .catch((error) => {
            return res.status(400).send('Not Found')
        })
})

apiRouter.get('/posts', (req, res) => {
    fs.readFile('./data.json', (error, data) => {
        if (error) {
            return res.status(400).send('Not Found')
        }
        return res.send(JSON.parse(data as any))
    })
})

apiRouter.get('/posts/:id', (req, res) => {
    const { id } = req.params
    
    if (typeof id !== 'number') return res.status(400).send('Not Found');

    fs.readFile('./data.json', (error, data) => {
        if (error) {

            return res.status(400).send('Not Found')
        }
        const posts = JSON.parse(data as any) as Post[]
        return res.send(posts.find(post => post.id == id))
    })
})

module.exports = {apiRouter}