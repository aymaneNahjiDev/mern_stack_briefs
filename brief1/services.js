const axios = require('axios');

const getUsers = ()=>{
    return axios.get('https://jsonplaceholder.typicode.com/users/');
}

const getPosts = ()=>{
    return axios.get(`https://jsonplaceholder.typicode.com/posts/`);
}

module.exports = {getUsers, getPosts}