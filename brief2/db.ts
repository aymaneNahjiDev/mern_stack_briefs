import mongoose from "mongoose";

const dbURI = 'mongodb://localhost:27017/aymane_test';

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));