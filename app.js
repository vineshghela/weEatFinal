var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); 

var bodyParser = require('body-parser') 
var exhbs = require('express-handlebars')
var nodemailer = require('nodemailer')

//firebase variable
var fireBase = require('firebase-admin');
var firebase = require('firebase');
//firebase ServiceAccountKey
var serviceAccount = require('./serviceAccount.json');

//fireBase link to credentials admin sdk
fireBase.initializeApp({
  credential: fireBase.credential.cert(serviceAccount),
  databaseURL: "https://weeat-ffa50.firebaseio.com"
});

//firebase for user computer
var config = {
  apiKey: "AIzaSyDCpsg6l1CJG3D2LW4ObPkYJsrb6xUcb9I",
  authDomain: "weeat-ffa50.firebaseapp.com",
  databaseURL: "https://weeat-ffa50.firebaseio.com",
  projectId: "weeat-ffa50",
  storageBucket: "weeat-ffa50.appspot.com",
  messagingSenderId: "343863612000"
};

firebase.initializeApp(config);


//routes used for url mapping
var indexRouter = require('./routes/index');
var homeRouter = require('./routes/home');
var firebaseDBRouter = require('./routes/firebaseDB');
//var stripeApiRouter = require('./routes/stripeApi');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'something', 
  resave: false,
  saveUninitialized: true
})); 


app.use('/', indexRouter);
app.use('/', homeRouter);
app.use('/', firebaseDBRouter);
//app.use('/charge', stripeApiRouter)


//stripe KEY


////////////////////////////////////////////////////////////
const stripe = require('stripe')('sk_test_9qlxQnmTZy9yFWpP0WThPmbg');
////////////////////////////////////////////////////////////


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.post('/charge', (req, res) => {

  const token = req.body.stripeToken;
  const amount = req.body.amount;
  const email = req.body.email;
 // console.log(email)
  stripe.charges.create({
    amount: amount,
    currency: "gbp",
    source: token

  }).then(charge => res.send(charge),
    
    function nodemailItem(){
      const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Purpose: WeEat Order </li>
        // <li>Email: ${req.body.email}</li>
        <li>Amount: ${req.body.amount} </li>
      </ul>
      <h3>Message</h3>
      <p>Order Completed and will be ready soon </p>
    `;
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      //port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: 'weeat.orders@gmail.com', // generated ethereal user
          pass: 'Ghela2010'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized:false
      }
    });
    console.log(email)
    var newemail = email;
    // setup email data with unicode symbols
    let mailOptions = {
      
        from: '"WeEat Orders"<weeat.orders@gmail.com>', // sender address
        to: newemail, // list of receivers
        subject: 'WeEat Order payment', // Subject line
        text: 'Order has been paid for and is starting to be made.', // plain text body
        html: output // html body
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
    });
    }
  
    ).catch(err => {
    console.log("Error:" + err);
    res.status(500).send({error: "Purchase Failed"})
  })
  console.log("we can only try")


  
});


// catch 404 error(page not found) and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handling
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//app.listen(3000);

module.exports = app;
