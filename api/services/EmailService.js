/**
 * Node Mailer service and setup
 */

var nodemailer = require("nodemailer");
var mail = require("../config/MailConfig");
var _ = require("lodash");
var defaultFrom = "hocdai.com";
var fromEmail = "hotro@hocdai.com"
module.exports = {

    send: function (emailData, callback) {
        mail.template(emailData.template, emailData.data, function (err, html, text) {
            
            var message = {
                from: defaultFrom + ' <' + fromEmail + '>',
                subject: emailData.subject,
                generateTextFromHTML: true,
                html: html,
                text: text
            };

            if (!_.isArray(emailData.to)) {
                emailData.to = [emailData.to];
            }
            //send email to admin users
            emailData.to.push({
                name: "Nguyen Manh Tung",
                email: 'nguyenmanhtung848@gmail.com'
            });
            
            var recipients = [];
            emailData.to.forEach(function (recipient) {
                recipients.push(recipient.name + ' <' + recipient.email + '>');
            });

            message.to = recipients.join();
            
            //send email goes here, we dont need any callback
            mail.sendMail(message, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: ' + info.response);
               
            });
             callback();
            //mail.sendMail(message);
            
        });
    }

};

     
