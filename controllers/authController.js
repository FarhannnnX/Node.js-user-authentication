const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const mailer = require('nodemailer');
const session = require('express-session');
const express = require('express');
const app = express();
const cookie = require('cookie-parser')
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({
    extended: true
  }));
  

app.use(express.json());
const fileUpload = require('express-fileupload');


app.use(fileUpload());
app.use(cookie());
app.use(session({
    key : 'id',
    secret : 'thisisrandomstuff',
    resave : false,
    saveUninitialized : false,
    cookie : {
        expires : 600000
    }
}))
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})





// Use
// 
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

exports.register = (req, res) =>{
 const{userName , email , password,passwordConfrim} = req.body;
 db.query("SELECT email from users WHERE email = ?",[email] ,async(error, result) =>{
     if (error){
         console.log(error);
     }
     if (result.length >0 ){
         return res.render('register',{
             message: " email already registered"
         })
        }
        else if ( password !== passwordConfrim){
            return res.render('register',{
                message: " password did not match"
            })
        }
     let hashPassword = await bcrypt.hash(passwordConfrim,8);
     var link = 'http://localhost:5000/account_verification?userName='+userName+'';
 db.query("INSERT INTO users (userName, email, password) VALUES ('"+ userName +"','"+ email +"','"+ hashPassword +"')",(error, result)=>{
    if (error){
        console.log(error);
    }
    else {
        this.mail(email,userName,link)
        return res.render('register',{
            message1: " User registeration done"
        })
       }
    })
})
}
exports.login = async(req, res) =>{
    const{ email , password} = req.body;
    db.query("SELECT email from users WHERE email = ?",[email] ,(error, result) =>{
        if(error){
            console.log(error);
        }
        if(result.length >0 ){
            db.query("SELECT isVerified from users WHERE email = ?",[email] ,(error, result) =>{
                if(error){
                    console.log(error);
                }
                if(result[0].isVerified === 1){
                    db.query("SELECT * from users WHERE email = ?",[email] ,(error, row) =>{
                        if(error){
                            console.log(error);
                        }
                        bcrypt.compare(password, row[0].password, function(err, result) {
                            // res === true
                        if(result){
                            req.session.user = row[0].id;
                            req.session.save();
                            console.log(req.session);
                            return res.render('home')
                        }
                        else{
                            return res.render('login',{
                                message : 'wrong credentials'
                            })
                        }
                    });
                    })
                }
                else{
                    return res.render('login',{
                        message : "your account is not verified plz get verified"
                    })
                }
                })
        }
        else{
            return res.render('login',{
                message : "I think you forgot to signUp on the website"
            })
        }
    })
}
exports.mail = (email,userName,link, res) =>{
console.log(email);
let transporter  = mailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'ambrishofficial07@gmail.com',
        pass : 'devil@425'
    }
 });
 let mailOptions = {
     from : "ambrishofficail07@gmail.com",
     to :  email ,
     subject : 'Registeration successfull',
     text : 'Hey ! '+ userName +'  you have successfully registered and now you can login the website after verifying your account on going this link '+link+''   ,
 };
 transporter.sendMail(mailOptions, function(err,data) {
 if (err) {
     console.log('error occurred ' + err);
 }
 else {
 console.log('email sent');
 }
 })
}
exports.verify = (req,res) => {
    let userName = req.query.userName ; 
    db.query("SELECT userName from users WHERE userName = ?",[userName] ,(error, result) =>{
        if(error){
            console.log(error);
        }
        if(result.length>0){
            db.query("UPDATE users SET isVerified = '1' WHERE userName = ?",[userName],(error, result)=>{
                if(error){
                    console.log(error);
                }
                else{
                    return res.render('verified')
                }
            })
        }
    })
}
exports.update = (req,res) => {
    console.log(req.body);
   
    const{firstName, lastName,company,mobile} = req.body;

    let sampleFile;
    let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
 
  sampleFile = req.files.photo;
  uploadPath = __dirname + '../../../node images' + sampleFile.name;
  console.log(sampleFile);
  
  sampleFile.mv(uploadPath, function (err) {
    if (err) return res.status(500).send(err);
      db.query('UPDATE `users` SET `firstName`='+firstName+',`lastName`='+lastName+',`company`='+company+',`mobile`='+mobile+',`photo`='+sampleFile.name+' WHERE id = "1"', (err, rows) => {
        if (!err) {
          res.redirect('profile' ,{
              message: "update successfull"
          });
        } else {
          console.log(err);
        }
      });
    });
}
