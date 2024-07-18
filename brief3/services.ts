import axios from "axios";
import { Post } from "./typing";


export const getUsers = ()=>{
    return axios.get('https://jsonplaceholder.typicode.com/users/');
}

export const getPosts = ()=>{
    return axios.get<Post[]>(`https://jsonplaceholder.typicode.com/posts/`);
}

