const express = require('express');
const app = express();
const router = express.Router();
const authController = require('../controllers/authController')
const mysql = require('mysql')

const session = require('express-session');

const cookie = require('cookie-parser')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({
    extended: true
  }));
  

app.use(express.json());



const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})




app.use(cookie());
app.use(session({
   
    
    secret : 'thisisrandomstuff',
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : 600000
    }
}))














router.get('/', (req, res) => {
    res.render('index')
})
router.get('/login', (req, res) => {
    if(req.session.user === undefined){
        res.render('login')

    }
    else{
        console.log(req.session.user);
        res.render('home')
    }
    
    
})
router.get('/register', (req, res) => {
    res.render('register')
})
router.get('/home',(req, res)=>{
    if(req.session.user === undefined){
        res.render('login')

    }
    else{
        
        res.render('home')
    }
})

router.get('/verified', (req, res)=>{
    res.render('verified')
})
router.get('/account_verification',authController.verify);



router.get('/profile',(req, res)=>{
    
    db.query('SELECT * FROM users WHERE id = "1"',(err, rows) => {
        
        if (!err) {
          res.render('profile', { rows });
        }
        else{
            console.log(err);
            console.log(err);
        }
      });
    
    
});








module.exports = router;