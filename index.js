const express = require("express");
const app =express();
const cors = require("cors");
const pool =require("./config/db");
const cookieParser = require("cookie-parser");
const cloudinary=require('./config/cloudinary')
const fileUpload = require('express-fileupload');

// Initialize fileUpload middleware


//API PATH
const todoRoutes = require('./routes/todo');
//middleware
cloudinary.cloudinaryConnect();
// app.use(fileUpload)

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
// Handle PostgreSQL unique constraint violation error


//API ROUTES
app.use('/', todoRoutes);

app.listen(5020, () => {
    console.log("server has started on port 5010");
});

