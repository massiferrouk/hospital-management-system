var express = require('express')
var flash = require('flash')
var router = express.Router()
var bodyParser = require('body-parser')
var nodemailer = require('nodemailer')
var randomToken = require('random-token')
var db = require.main.require('./models/db_controller')

router.post('/', function (req, res) {
    var email = req.body.email
    db.findOne(email, function (err,resultone) {
        if(!resultone) {
            console.log("Mail does not exist")
            res.send("Mail does not exist")
        }
        var id = resultone[0].id
        var email = resultone[0].email
        var token = randomToken(8)
        db.temp(id, email, token, function (err,resultwo) {
            var output = `<p>Dear user,</p>
            <p>You are receiving this email because you rquested to reset your password</p>
            <ul>
            <li>User ID : `+id+`</li>
            <li>Token : `+token+`</li>

            </ul>
            `
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'm_ferrouk@estin.dz',
                    pass: 'pass'
                }
            })
            var mailOptions = {
                from: 'HMS Team',
                to: email,
                subject: 'Password reset',
                html: output
            }
            transporter.sendMail(mailOptions, function (err, info) {
                if(err) {
                    return console.log(err)
                } else {
                    console.log(info)
                }
            })

        })
    })
    res.send("a token has been send to your email address")
})

module.exports = router