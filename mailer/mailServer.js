const mailer = require('nodemailer');

let transporter  = mailer.createTransport({
   service : 'gmail',
   auth : {
       user : 'ambrishofficial07@gmail.com',
       pass : 'devil@425'
   }




});


let mailOptions = {
    from : "ambrishofficail07@gmail.com",
    to : 'ambrish.shalini07@gmail.com',
    subject : 'heloo',
    text : 'hello',


};

transporter.sendMail(mailOptions, function(err,data) {
if (err) {
    console.log('error occurred ' + err);
}
else {

console.log('email sent');
}
})