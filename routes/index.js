var express = require('express');
var router = express.Router();
var firebase = require('firebase');

//Main route for home page

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("main page");
    res.render('index', {
        title: 'WeEat'
    });
});




router.get('/signIn', function(req, res, next) {
    console.log("sign in page");
    res.render('signIn', {
        title: 'WeEat-Login'
    });
});

router.get('/about', function(req, res, next) {
    console.log("About us");
    res.render('about', {
        title: 'WeEat-About Us'
    });
});

router.get('/review', function(req, res, next) {
    console.log("Review us");
    var data = []
    var databaseRef = firebase.database().ref().child('review');
    databaseRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            data.push(childData)
        });
        console.log(data)
        res.render('review', {
            title: 'WeEat-Reviews',
            datalist: data
        });
    })
});



router.post('/addreview', function(req, res, next) {
    var firstname = req.body.FirstName
    var secondname = req.body.SecondName
    var email = req.body.email
    var number = req.body.radios
    var reviewTitle = req.body.title
    var reviewBody = req.body.review
    console.log(firstname)
    console.log(secondname)
    console.log(email)
    console.log(number)
    console.log(reviewBody)
    //Firebase function for adding record to realtime DB
    var databaseRef = firebase.database().ref();
    databaseRef.once('value', function(snapshot) {
        firebase.database().ref().child('review').push({
            firstName: firstname,
            secondName: secondname,
            Email: email,
            rating: number,
            title: reviewTitle,
            review: reviewBody
        });

        function displayHomie() {
            res.redirect('/review');
        }
        setTimeout(displayHomie, 1500);
        console.log('successfullllll');
    });
    res.redirect("/review")
})





module.exports = router;
