// this route/mapping is used for firbase functions of logging in and out
var express = require('express');
var router = express.Router();
//firebase module required
var firebase = require('firebase');
var admin = require('firebase-admin');

// firebase Db settings

/* GET users listing. */
router.post('/login', function (req, res, next) {
    //var password and email parsed to vars below
    var email = req.body.email
    var password = req.body.password
    console.log(email + password)
    req.session.email = email;
    //Firebase function to log user in with credentials passed
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (data) {
            //console.log(data);
            res.redirect('/home');
        })
        .catch(function (error) {
            // Handle errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error);
            res.render('signIn', {
                title: 'WeEat-home',
                fbLoginError: error
            });
        });
});

/* GET users listing. */
router.get('/AccessDenied', function (req, res, next) {
    res.status(403);
    res.render('signin', {
        fbLoginError: '....Oh no looks like you not signed in, please sign in and try again'
    });
})

/* GET users listing. */
router.get('/home', function (req, res, next) {
    //statement checks that a session is in place and does not allow access.
    if (req.session.email) {
        console.log("home router");
        var data = []
        var data2 = []
        console.log("Home page")
        var databaseRef = firebase.database().ref('Requests');
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (snapshot2) {
                //console.log('----------------')
                var keyys = snapshot2.key
                //console.log("keyysss",keyys)
                //console.log(snapshot.val())
                //console.log(snapshot2.val())
                data2.push(keyys)
                data.push(snapshot2.val());
            });
           // console.log(data);
            firebase.auth().onAuthStateChanged(function (user) {
                console.log(user.email)
                res.render('home', {
                    title: 'WeEat-Home',
                    userDetails: user.email,
                    datalist: data,
                    key: data2
                });
            });
        })
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});


router.post('/update1/:prodStatus1', function (req, res, next) {
    if (req.session.email) {
        var productID1 = req.params.prodStatus1;
        console.log(productID1);
        console.log("ready to update");
        var databaseRef = firebase.database().ref();
        var productStatus1 = databaseRef.child("Requests");
        var status1 = productStatus1.child(productID1);
        status1.update({
            "orderStatus": "1"
        });
        console.log('Done');
        res.redirect('/home')
            // res.send("HIII")
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }

});
router.post('/update2/:prodStatus2', function (req, res, next) {
    if (req.session.email) {
        var productID2 = req.params.prodStatus2;
        console.log(productID2);
        console.log("ready to update");
        var databaseRef = firebase.database().ref();
        var productStatus2 = databaseRef.child("Requests");
        var status2 = productStatus2.child(productID2);
        status2.update({
            "orderStatus": "2"
        });
        console.log('Done');
        res.redirect('/home')
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});
router.post('/update3/:prodStatus3', function (req, res, next) {
    if (req.session.email) {
        var productID3 = req.params.prodStatus3;
        console.log(productID3);
        console.log("ready to update");
        var databaseRef = firebase.database().ref();
        var productStatus3 = databaseRef.child("Requests");
        var status3 = productStatus3.child(productID3);
        status3.update({
            "orderStatus": "3"
        });
        console.log('Done');
        res.redirect('/home')
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

//add a record
router.post('/addRecord', function (req, res, next) {
    if (req.session.email) {
        var prodName = req.body.productName
        var prodcat = req.body.category
        var productDescription = req.body.prodDescription
        var Productallergy = req.body.Productallergy
        var productPrice = req.body.price
        var imageitem = req.body.menuImage
        //Firebase function for adding record to realtime DB
        var databaseRef = firebase.database().ref();
        var data = {};
        databaseRef.once('value', function (snapshot) {
            var uid = firebase.database().ref().child('productItems').push().key;
            console.log('uid: ', uid);
            data = {
                userkey: uid,
                productName: prodName,
                menuID: prodcat,
                productDescription: productDescription,
                Productallergy: Productallergy,
                productPrice: productPrice,
                image: imageitem
            }
            var updates = {};
            updates['/productItems/' + uid] = data;
            databaseRef.update(updates);
            console.log('data1', data);
            console.log('successfullllll');
        });

        res.redirect('menuList');
        // });
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.post('/addNewCatagory', function (req, res, next) {
    if (req.session.email) {
        var catagoryName = req.body.catName
        var image = req.body.catImage
        //Firebase function for adding record to realtime DB
        var databaseRef = firebase.database().ref();
        var data = {};
        databaseRef.once('value', function (snapshot) {
            var uid = firebase.database().ref().child('category').push().key;
            console.log(uid);
            data = {
                userkey: uid,
                name: catagoryName,
                image: image
            }
            // var updates = [];
            // updates['/category/' + uid] = data;
            // databaseRef.set(updates);
            databaseRef.child('/category/' + uid).set({
                userkey: uid,
                name: catagoryName,
                image: image});


            console.log('data1', data);
            console.log('successfullllll');
            //});
            res.redirect('catagory');
        });
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }

});

router.post('/updateNewCatagory/:key', function (req, res, next) {
    if (req.session.email) {
        var uid = req.params.key
        var catagoryName = req.body.catName
        var image = req.body.catImage
        //Firebase function for adding record to realtime DB
        var databaseRef = firebase.database().ref();
        var data = {};
        console.log(uid);
        data = {
            userkey: uid,
            name: catagoryName,
            image: image
        }
        var updates = [];
        updates['/category/' + uid] = data;
        databaseRef.update(updates);
        console.log('data1', data);
        console.log('successfullllll');
        var error = "product with key " + uid + "has been updated to "
        var data = []
        var databaseRef = firebase.database().ref().child('category');
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                data.push(childData)
            });

            res.render('addNewCat', {
                datalist: data,
                fbLoginError: error
            });
        })
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
        res.redirect('./AccessDenied')
    }

});

router.get('/catagory', function (req, res, next) {
    if (req.session.email) {
        var data = []
        var databaseRef = firebase.database().ref().child('category');
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                data.push(childData)
            });
            firebase.auth().onAuthStateChanged(function (user) {
                console.log(user.email)
                console.log(data)
                function displayHomie() {
                res.render('addNewcat', {
                    title: 'WeEat-cat List',
                    datalist: data,
                    userDetails: user.email
                })
            }
            setTimeout(displayHomie, 1500);
            })
        });
        
    
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});


router.get('/catagoryEdit/:key', function (req, res, next) {
    if (req.session.email) {
        var productID = req.params.key;
        console.log(productID);
        console.log("ready to edit");
        var databaseRef = firebase.database().ref().child('category/' + productID);
        databaseRef.once('value').then(function (snapshot) {
            var value = snapshot.val();
            console.log('location:', value);
            var data = []
            var databaseRef = firebase.database().ref().child('category');
            databaseRef.once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();
                    data.push(childData)
                });
                console.log(data)
                res.render('addNewcatEdit', {
                    title: 'WeEat-cat List',
                    datalist: data,
                    key: value
                })
            });
        })
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});

router.get('/delete/:prodid', function (req, res, next) {
    if (req.session.email) {
        var productID = req.params.prodid;
        console.log(productID);
        var databaseRef = firebase.database().ref().child('productItems/' + productID);
        databaseRef.remove();
        console.log("deleted");
        res.redirect('../menuList')
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});

router.get('/deleteCat/:catid', function (req, res, next) {
    if (req.session.email) {
        var productID = req.params.catid;
        console.log(productID);
        var databaseRef = firebase.database().ref().child('category/' + productID);
        databaseRef.remove();
        console.log("deleted");
        res.redirect('../catagory')
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});

router.get('/menuList', function (req, res, next) {
    if (req.session.email) {
        var data = []
        var databaseRef = firebase.database().ref().child('productItems');
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                data.push(childData)
            });
            firebase.auth().onAuthStateChanged(function (user) {
                console.log(user.email)
                console.log(data)
                res.render('menuList', {
                    title: 'WeEat-Menu List',
                    datalist: data,
                    userDetails: user.email
                })
            })
        });
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.get('/menuForm', function (req, res, next) {
    if (req.session.email) {
        console.log("menu page");
        var data = []
        var databaseRef = firebase.database().ref().child('category');
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                data.push(childData)
                console.log(childData)
            });
            var data2 = []
            var databaseRef2 = firebase.database().ref().child('allergy');
            databaseRef2.once('value', function (snapshot1) {
                snapshot1.forEach(function (childSnapshot1) {
                    var childData1 = childSnapshot1.val();
                    data2.push(childData1)
                });
                firebase.auth().onAuthStateChanged(function (user) {
                    console.log(user.email)

                    console.log(data)
                    console.log(data2)
                    res.render('menuForm', {
                        title: 'WeEat-Add items',
                        datalist: data,
                        datalist2: data2,
                        userDetails: user.email
                    });
                })
            })
        })
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});
//delete a record
router.get('/delete/:prodid', function (req, res, next) {
    if (req.session.email) {
        var productID = req.params.prodid;
        console.log(productID);
        var databaseRef = firebase.database().ref().child('productItems/' + productID);
        databaseRef.remove();
        console.log("deleted");
        res.redirect('../menuList')
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

//edit product
router.get('/edit/:prodid', function (req, res, next) {
    if (req.session.email) {
        var productID = req.params.prodid;
        console.log(productID);
        console.log("ready to edit");
        var databaseRef = firebase.database().ref().child('productItems/' + productID);
        databaseRef.once('value').then(function (snapshot) {
            var value = snapshot.val();
            console.log('location:', value);
            var data = []
            var databaseRef = firebase.database().ref().child('category');
            databaseRef.once('value', function (snapshot) {
                snapshot.forEach(function (childSnapshot) {
                    var childData = childSnapshot.val();
                    data.push(childData)
                    console.log(childData)
                });
                var data2 = []
                var databaseRef2 = firebase.database().ref().child('allergy');
                databaseRef2.once('value', function (snapshot1) {
                    snapshot1.forEach(function (childSnapshot1) {
                        var childData1 = childSnapshot1.val();
                        data2.push(childData1)
                    });
                    console.log(data2)

                    res.render('menuEditForm', {
                        datalist: value,
                        datalist1: data,
                        datalist2: data2
                    });
                })
            })
        })
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});




router.get('/deleteUser/:email/key/:key', function (req, res, next) {
    if (req.session.email) {
        var Userid = req.params.key;
        var UserEmail = req.params.email;
        console.log(UserEmail)
        console.log(Userid)
        //var databaseRef = firebase.database().ref().child('authAdminUsers/' + Userid);
        //databaseRef.remove();
        //console.log("deleted");
        admin.auth().getUserByEmail(UserEmail)
            .then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log('Successfully fetched user data:', userRecord.toJSON());
                console.log(userRecord.toJSON().uid)
                var user = userRecord.toJSON().uid
                console.log(user)
                admin.auth().deleteUser(Userid)
                    .then(function () {
                        console.log('Successfully deleted user');
                    })
                    .catch(function (error) {
                        console.log('Error deleting user:', error);
                    })
            })
            .catch(function (error) {
                console.log('Error fetching user data:', error);
            });
        res.redirect('/addNewUser')
        res.send(Userid, "------------", UserEmail)
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});

router.post('/updateEmail', function (req, res, next) {
    if (req.session.email) {
        firebase.auth().onAuthStateChanged(function (user) {
            var currentEmail = req.body.currentEmail;
            var newEmail = req.body.newEmail;
            //come back to this to ensure validation takes place 
            //making sure email is the same
            var confirmNewEmail = req.body.confirmNewEmail;
            var userauth = firebase.auth().currentUser;
            var loggedinUser = firebase.auth().currentUser.email;

            if (currentEmail == loggedinUser) {
                userauth.updateEmail(newEmail);
                console.log('User email has been updated', newEmail);
                res.render('profile');
            } else {
                console.log('you cannot change another users email');
            }
        })
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.post('/updatePassword', function (req, res, next) {
    if (req.session.email) {
        firebase.auth().onAuthStateChanged(function (user) {
            var currentPassword = req.body.currentPassword;
            var newPassword = req.body.newPassword;
            //come back to this to ensure validation takes place 
            //making sure password is the same
            var confirmnewPassword = req.body.confirmNewPassword;
            var userauth = firebase.auth().currentUser;
            var loggedinUser = firebase.auth().currentUser.password;

            if (newPassword == confirmnewPassword) {
                userauth.updatePassword(newPassword);
                console.log('User password has been updated');
                res.render('profile');
            } else {
                console.log('you cannot change another users email');
            }
        })
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});
router.post('/updateDisplayName', function (req, res, next) {
    if (req.session.email) {
        firebase.auth().onAuthStateChanged(function (user) {

        })
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.post('/addNewAllergy', function (req, res, next) {
    if (req.session.email) {
        var allername = req.body.allergyName
        //Firebase function for adding record to realtime DB
        var databaseRef = firebase.database().ref();
        var data = {};
        databaseRef.once('value', function (snapshot) {
            var uid = firebase.database().ref().child('allergy').push().key;
            console.log(uid);
            data = {
                allergyKey: uid,
                name: allername
            }
            var updates = {};
            updates['/allergy/' + uid] = data;
            databaseRef.update(updates);
            console.log('data1', data);
            console.log('successfullllll');
        });

        function displayHomie() {
            res.redirect('/allergy');
        }

        setTimeout(displayHomie, 1500);
        // });
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.post('/addNewAllergyUpdate/:key', function (req, res, next) {
    if (req.session.email) {
        var uid = req.params.key
        var allername = req.body.allergyName
        //Firebase function for adding record to realtime DB
        var databaseRef = firebase.database().ref();
        var data = {};
            console.log(uid);
            data = {
                allergyKey: uid,
                name: allername
            }
            var updates = {};
            updates['/allergy/' + uid] = data;
            databaseRef.update(updates);
            console.log('data1', data);
            console.log('successfullllll')

        function displayHomie() {
            res.redirect('/allergy');
        }

        setTimeout(displayHomie, 1000)
        // });
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});



router.get('/allergy', function (req, res, next) {
    if (req.session.email) {
        var data = []
        var databaseRef = firebase.database().ref().child('allergy');
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                data.push(childData)
            });
            firebase.auth().onAuthStateChanged(function (user) {
                console.log(user.email)
                console.log(data)
                res.render('addNewAllergy', {
                    title: 'WeEat-cat List',
                    datalist: data,
                    userDetails: user.email
                })
            })
        });
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.get('/allergyEdit/:key', function (req, res, next) {
    if (req.session.email) {
        var uid = req.params.key;
        var data = []
        var databaseRef = firebase.database().ref().child('allergy');
        databaseRef.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var childData = childSnapshot.val();
                data.push(childData)
            });
            console.log("ready to edit");
            var databaseRef = firebase.database().ref().child('allergy/' + uid);
            databaseRef.once('value').then(function (snapshot) {
                var value = snapshot.val();
                console.log('location:', value);
                firebase.auth().onAuthStateChanged(function (user) {
                    console.log(user.email)
                    console.log(data)
                    res.render('addNewAllergyEdit', {
                        title: 'WeEat-cat List',
                        datalist: data,
                        userDetails: user.email,
                        datalist1: value
                    })
                });
            })
        });
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.get('/addFile', function (req, res, next) {
    if (req.session.email) {
        //var productID = req.params.prodid;
        var fileName = req.param.catagoryImage
        console.log(productID);
        var file =
            // var storageRef = firebase.storage().ref('test/'+ fileName)
            storageRef.put(file)
        // var databaseRef = firebase.database().ref().child('productItems/'+ productID); 
        // databaseRef.remove();
        // console.log("deleted");
        res.redirect('../menuList')
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

router.get('/reviewOverview', function (req, res, next) {
    if (req.session.email) {
        var data = []
        var data2 = []
    //var databaseRef = firebase.database().ref().child('review');
    var databaseRef = firebase.database().ref('review');
    databaseRef.once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var keyys = childSnapshot.key
            data2.push(keyys)
            data.push(childData)
        });
        firebase.auth().onAuthStateChanged(function (user) {
            console.log(user.email)
        res.render('adminReview',
        {
            title: 'WeEat-Reviews',
            userDetails: user.email,
            datalist:data,
            key: data2   
    })
    })
    })
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

//Dashboard 
router.get('/dashboard', function (req, res, next) {
    if (req.session.email) {
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
        
                                    firebase.auth().onAuthStateChanged(function (user) {
                                    console.log(user.email);
                                    res.render('dashboard', {
                                        title: 'WeEat-Stats',
                                        userDetails: user.email,
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
                                 })
                            })
                        })
                    })
                })
            })
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
  });

router.get('/deleteReView/:reviewKey', function (req, res, next) {
    if (req.session.email) {
        var reviewID = req.params.reviewKey;
        console.log(reviewID);
        var databaseRef = firebase.database().ref().child('review/' + productID);
         databaseRef.remove();
        console.log("deleted");
        res.redirect('../reviewOverview')
        //res.send(reviewID)
    } else {
        console.log('you got kicked out')
        res.redirect('../AccessDenied');
    }
});

router.get('/deleteAllergy/:allergyKEY/', function (req, res, next) {
    if (req.session.email) {
        var allergyid = req.params.allergyKEY;
        console.log(allergyid);
        var databaseRef = firebase.database().ref().child('allergy/' + allergyid);
        databaseRef.remove();
        console.log("deleted");
        res.redirect('../allergy')
    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});


router.post('/addNewUserForm', function (req, res, next) {
    if (req.session.email) {
        var email = req.body.email
        var password = req.body.password
        //Firebase function for adding record to realtime DB
        var data = {};
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
                var databaseRef = firebase.database().ref();
                
                databaseRef.once('value', function (snapshot) {
                    var uid = firebase.database().ref().child('authAdminUsers').push().key;
                    console.log("adding to db")
                    console.log(uid)
                    data = {
                        name: email,
                        userKey: uid
                    }
                    var updates = [];
                    updates['/authAdminUsers/' + uid] = data;
                    databaseRef.update(updates);
                    console.log('data1', data);
                    //console.log('successfullllll');
                    //console.log(uid)
                    console.log(email)
            
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log("error code", errorCode)
                console.log("error message", errorMessage)
            });
            
            admin.auth().getUserByEmail(email)
            .then(function (userRecord) {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log('Successfully fetched user data:', userRecord.toJSON());
                console.log(userRecord.toJSON().uid)
                var user = userRecord.toJSON().uid
                console.log(user)
                admin.auth().setCustomUserClaims(user,{
                    admin : true
                })
                }).then(function () {
                    console.log("Has been made admin", email)
    
                    })
                    .catch(function (error) {
                        console.log('Error making user admin:', error);
                    })
            
        // var data = []
        // var databaseRef = firebase.database().ref().child('authAdminUsers');
        // databaseRef.once('value', function(snapshot) {
        //     snapshot.forEach(function(childSnapshot) {
        //         var childData = childSnapshot.val();
        //         data.push(childData)
        //     });
        //     console.log(data)
        // })
        res.redirect('addNewUser');
    })
    

    } else {
        console.log('you got kicked out')
        res.redirect('AccessDenied');
    }
});

module.exports = router;