const express = require('express');

const port = 8000;

const app = express();

// const db = require('./config/db')

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://srushtitejani20:mMexp0i1kvLcMvnu@cluster0.m56ey.mongodb.net/userAPI").then((res)=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log("err");
})

const passport = require('passport');
const jwtStrategy = require('./config/passport-jwt-Strategy');
const session = require('express-session');

app.use(session({
    name :'jwtsession',
    secret:'jwtSkey',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge : 1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded());

app.use('/',require('./routes'));

app.listen(port, (err)=>{
    if (err) throw err;
    console.log("server is running on port:",port);
})