/**
 * Node Mailer service and setup
 */

var nodemailer = require("nodemailer");


var smtpConfig = {
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'test@gmail.com',
        pass: 'abcas'
    }
}

module.exports = nodemailer.createTransport(smtpConfig, {
    // default values for sendMail method
    from: 'hocdai.com',
    headers: {
        'hocdai.com reset password': 'this email is from hocdai.com'
    }
});

     
