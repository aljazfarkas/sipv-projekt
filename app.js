var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var lessMiddleware = require('less-middleware')
var logger = require('morgan')
var cors = require('cors')
const mongoose = require('mongoose')
const expressEjsLayout = require('express-ejs-layouts')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
require('./config/passport')(passport)
require('dotenv').config()

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var foodRouter = require('./routes/food')

var app = express()

//mongoose
mongoose
  .connect('mongodb://localhost:27017/sipv', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connected to database...'))
  .catch(err => console.log(err))

//EJS
app.set('view engine', 'ejs')
app.use(expressEjsLayout)

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(lessMiddleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
//express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())
app.use(passport.session())
//use flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/food', foodRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
