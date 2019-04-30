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




router.get('/test', function(req, res, next) {


    var d = new Date()

    //month to 0
    var month = d.getMonth() + 1;
    if (month.toString().length == 1) {
        month = '0' + month
    } else {
        month.toString()
    }
    console.log("the month is " + month.toString())
    //date to 0
    var day = d.getDate();
    if (day.toString().length == 1) {
        day = '0' + day
    } else {
        day.toString()
    }
    console.log("the date is " + day.toString());
    //get all products from requests
    var data1 = []
    var databaseRef = firebase.database().ref().child('Requests');
    databaseRef.once('value', function(snapshot) {
        //used to count number of records totals
        var i = 0
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            data1.push(childData)
            i++;
        });
        console.log(i)
        var data11 = []
        var databaseRef = firebase.database().ref().child('Requests')
        databaseRef.once('value', function(snapshot) {
            //used to count number of records totals
            var x = 0
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                data11.push(childData)
                x++;
            });
            var zero = 0;
            var one = 0;
            var two = 0;
            var three = 0;
            for (var i in data11) {
                var current = data11[i].orderStatus
                if (current == '0') {
                    zero++
                }
                if (current == '1') {
                    one++
                }
                if (current == '2') {
                    two++
                }
                if (current == '3') {
                    three++
                }
            }
            console.log('0: ', zero)
            console.log('1: ', one)
            console.log('2: ', two)
            console.log('3: ', three)

            var data12 = []
            var databaseRef = firebase.database().ref().child('Requests');
            databaseRef.once('value', function(snapshot) {
                //used to count number of records totals
                //var i = 0
                snapshot.forEach(function(childSnapshot) {
                    var childData = childSnapshot.val();
                    data12.push(childData)
                    //i++;
                });
                var	January=0;
                var	Feburary=0;
                var	March=0;
                var	April=0;
                var	May=0;
                var	June=0;
                var	July=0;
                var	August=0;
                var	September=0;
                var	October=0;
                var	November =0;
                var	December = 0;
                var ordersToday = 0;
                var ordersYesterday = 0;
                var orderThisMonth = 0;
                var orderLastMonth = 0;
                var total =0; 
                for (i in data12) {
                    // var test = data12.spl
                    var currentOrder = data12[i].orderDatePlaced
                    // console.log(currentOrder)
                    // console.log(res)
                    var test = currentOrder.split(' ')
                    //console.log(test[1])
                    var testtt = currentOrder.split('/')
                    var vinesh = currentOrder.split(' ')
                    var newD = vinesh[1].split('/')
                    var newDD = newD[0]
                    var getmonth = testtt[1]
                    //console.log(testtt[1]);
                    if (testtt[1] == month)
                        orderThisMonth++;
                    if(testtt[1] == "01")
                        January++
                    if(testtt[1] == "02")
                        Feburary++
                    if(testtt[1] == "03")
                        March++
                    if(testtt[1] == "04")
                        April++
                    if(testtt[1] == "05")
                        May++
                    if(testtt[1] == "06")
                        June++
                    if(testtt[1] == "07")
                        July++
                    if(testtt[1] == "08")
                        August++
                    if(testtt[1] == "09")
                        September++
                    if(testtt[1] == "10")
                        October++
                    if(testtt[1] == "11")
                        November++
                    if(testtt[1] == "12")
                        December++
                    if (testtt[1] == month - 1)
                        orderLastMonth++;
                    //currentOrder++
                    if (newDD == day.toString())
                        ordersToday++
                    var tempData = day - 1
                    if (newDD == tempData.toString())
                        ordersYesterday++
                
                    var totaltobepaid = data12[i].totalAmount; 
                    //convert into integers
                    var totalint = parseInt(totaltobepaid)
                    total +=totalint; 
                    }
                    
                    console.log('total: ', total)




                console.log("we made this many orders this month " + orderThisMonth);
                console.log("we made this many orders last month " + orderLastMonth);
                console.log("we made this many orders today " + ordersToday);
                console.log("we made this many orders yesterday " + ordersYesterday);
                //console.log(day)
                // console.log(vinesh[1].split("/"))


                var data2 = []
                var databaseRef = firebase.database().ref().child('category');
                var y = 0;
                databaseRef.once('value', function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                        var childData = childSnapshot.val();
                        data2.push(childData)
                        y++;

                    });
                    //console.log(childData)
                    var data3 = []
                    var databaseRef = firebase.database().ref().child('productItems');
                    databaseRef.once('value', function(snapshot) {
                        var z = 0;
                        snapshot.forEach(function(childSnapshot) {
                            var childData = childSnapshot.val();
                            data3.push(childData)
                            z++
                        });

                        var data4 = []
                        var databaseRef = firebase.database().ref().child('productItems');
                        databaseRef.once('value', function(snapshot) {
                            snapshot.forEach(function(childSnapshot) {
                                var childData = childSnapshot.val();
                                data4.push(childData)
                            });

                            
                            console.log("January"+January)
                            console.log("Feburary"+Feburary)
                            console.log("March"+March)
                            console.log("April"+April)
                            console.log("May"+May)
                            console.log("June"+June)
                            console.log("July"+July)
                            console.log("August"+August)
                            console.log("September"+September)
                            console.log("October"+October)
                            console.log("November"+November)
                            console.log("December"+December)

                            //firebase.auth().onAuthStateChanged(function (user) {
                            //console.log(user.email);
                            res.render('dashboardDELETE', {
                                title: 'WeEat-Stats',
                                // userDetails: user.email,
                                orders: data1,
                                totalCount: i,
                                cat: data2,
                                prod: data3,
                                productItems: data4,
                                status0: zero,
                                status1: one,
                                status2: two,
                                status3: three,
                                totalCatCount: y,
                                totalProdCount: z,
                                noOrderThisMonth: orderThisMonth,
                                noOrderLastMonth: orderLastMonth,
                                noOrderToday: ordersToday,
                                noOrderYesterday: ordersYesterday,
                                revenu:total,
                                orderJanuary:January,
                                orderFeburary:Feburary,
                                orderMarch:March,
                                orderApril:April,
                                orderMay:May,
                                orderJune:June,
                                orderJuly:July,
                                orderAugust:August,
                                orderSeptember:September,
                                orderOctober:October,
                                orderNovember:November,
                                orderDecember:December
                            })
                        })
                        // })
                    })
                })
            })
        })
    })
});


module.exports = router;
