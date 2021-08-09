const express = require('express');
const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
dotenv.config({ path: './.env' });
const app = express();
const session = require('express-session');
var bodyParser = require('body-parser')


app.use(session({
    key : 'userId',
    secret : 'thisisrandomstuff',
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : 600000
    }
}))



var sessionChecker = (req, res, next) => {
    if (req.session.user){
        res.render('home')
    }
    else{
        next();
    }

}

app.use(bodyParser.urlencoded({
    extended: true
  }));



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})



const publicDirectory = path.join(__dirname, 'public');



app.use(express.static(publicDirectory));



app.use(express.urlencoded({ extended:true }));



app.use(express.json());

app.use(cookieParser());


app.set('view engine', 'hbs');



db.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Connected");
    }
})



app.use('/', require('./routes/web'));

app.use('/auth', require('./routes/auth'));




app.listen(5000, () => {

    console.log("Server running at http://localhost:5000");
})