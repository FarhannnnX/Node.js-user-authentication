const express = require('express');
const  app = express();
const authController = require('../controllers/authController')

const router = express.Router();
const session = require('express-session');

const cookie = require('cookie-parser')
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({
    extended: true
  }));
  

app.use(express.json());
  


app.use(cookie());
app.use(session({
    
    secret : 'thisisrandomstuff',
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : 600000
    }
}))





router.post('/register',
    authController.register
);  

router.post('/login',authController.login);

router.post('/update',authController.update);


router.get('/account_verification',authController.verify);

module.exports = router; 
