var express = require('express')
var router = express.Router()
var bodyParser = require('body-parser')
var db = require.main.require('./models/db_controller')
var mysql = require('mysql')
var session = require('express-session')
var sweetalert = require('sweetalert2')
const {check, validationResult} = require('express-validator')

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_db'
})

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post('/', [check('username').notEmpty().withMessage("username is required"),
check('password').notEmpty().withMessage("password is required")
], function(request, response) {
    const errors = validationResult(request)
    if(!errors.isEmpty()) {
        return response.status(422).json({errors: errors.array()})
    }
    var username = request.body.username
    var password = request.body.password

    if (username && password) {
        con.query('select * from users where username = ? and password = ?', [username, password],
           function(error, results, fields) {
                if (results.length > 0) {
                    request.session.loggedin = true
                    request.session.username = username
                    response.cookie('username', username)
                    var status = results[0].email_status
                    if(status == 'not_verified'){
                        response.send("please verify your email")
                    } else {
                        sweetalert.fire('logged in')
                        response.redirect('/home')
                    }
                } else {
                    response.send("incorrect username or password")
                }
                response.end()
           })
    }else {
        response.send("please enter your username and password")
        response.end()
    }
})

module.exports =router