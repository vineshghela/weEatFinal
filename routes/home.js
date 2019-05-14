var express = require('express');
var router = express.Router();
//firebase module required
var firebase = require('firebase');
var admin = require('firebase-admin')
//after auth route


//logout
router.get('/logout', function (req, res, next) {
  firebase.auth().signOut().then(function () {
    console.log('you are out of here');
    req.session.destroy();
    res.render('SignOut', { title: 'WeEat-Logout' });
  })
    .catch(function (error) {
      // Handle errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
    });

});

/* GET users listing. */
router.get('/profile', function (req, res, next) {
  if (req.session.email) {
    console.log("profile page");
    res.render('profile', { title: 'WeEat-Account settings' });
  } else {
    console.log('you got kicked out')
    res.render('signIn');
  }
});


router.post('/UpdateMenuItem/:key', function (req, res, next) {
  if (req.session.email) {
      var uid = req.params.key
      var prodName = req.body.productName
      var prodcat = req.body.category
      var productDescription = req.body.prodDescription
      var Productallergy = req.body.Productallergy
      var productPrice = req.body.price
      var imageitem = req.body.menuImage
      //Firebase function for adding record to realtime DB
      var databaseRef = firebase.database().ref();
      var data = {};
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
      //});
      var error = "product with key " + uid + "has been updated"
      
      var data = []
      var databaseRef = firebase.database().ref().child('productItems');
      databaseRef.once('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
              var childData = childSnapshot.val();
              data.push(childData)
          });
          firebase.auth().onAuthStateChanged(function (user) {
          console.log(data)
          res.render('menuList', {
              title: 'WeEat-Menu List',
              datalist: data,
              fbLoginError: error,
              userDetails: user.email

          })
      });
  })
  } else {
      console.log('you got kicked out')
      res.redirect('../AccessDenied');
  }

});

//speical offer
router.get('/offer', function (req, res, next) {
  if (req.session.email) {
      firebase.auth().onAuthStateChanged(function (user) {
          console.log(user.email);
          console.log(user.displayName);
          res.render('offer', {
              title: 'WeEat-Special offer',
              userDetails: user.email
          })
      })
  } else {
      console.log('you got kicked out')
      res.redirect('AccessDenied');
  }
});


//Add new admin user 
router.get('/addNewUser', function (req, res, next) {
  if (req.session.email) {
          // console.log(user.email);
          admin.auth().getUserByEmail(req.session.email).then(function(user){
            var data =[]
            admin.auth().listUsers().then(function(listUserResult){
              listUserResult.users.forEach(function(userRecord){
                data.push(userRecord.toJSON())
              });
              console.log(data)
              res.render('addNewUser', {
                        title: 'WeEat-Add new user',
                        userDetails: user.email,
                        datalist: data
                    })
            })
          }).catch(function(error){
            console.log(error.message)
          })


          // var data = []
          // var databaseRef = firebase.database().ref().child('authAdminUsers');
          // databaseRef.once('value', function (snapshot) {
          //     snapshot.forEach(function (childSnapshot) {
          //         var childData = childSnapshot.val();
          //         data.push(childData)
          //         console.log(childData);
          //     });
          //     console.log(data)
          //     res.render('addNewUser', {
          //         title: 'WeEat-Add new user',
          //         userDetails: user.email,
          //         datalist: data
          //     })
          // })
      
  } else {
      console.log('you got kicked out')
      res.redirect('AccessDenied');
  }
});


//list  items page

//AJAX---------------------------------------
/*router.get('', function (req, res) {
  var user = firebase.auth().currentUser;
  if (user != null) {
    var name = req.param.displayName;
  console.log(name); 
    name = user.displayName;
    email = user.email;
    console.log(name)
    console.log(email);
    user.updateProfile({
      displayName: '"' + val + '"'
    }).then(function (result) {
      // Update successful.
      console.log('display name : ', user.displayName);
      console.log('updated name');
    }).catch(function (error) {
      console.log(error);
    });

    res.send('AJAX has taken place ')
  }
});
*/
//a  items page
router.post('/updateDisplayName', function (req, res, next) {
  console.log('profile page')
  if (req.session.email) {
    var user = firebase.auth().currentUser;
    if (user != null) {
    var name2 =req.body.displayName; 
    console.log(name2);
    res.write('done')
    }else{
      console.log('something has gone wrong')
    }
  } else {
    console.log('you got kicked out')
    res.render('signIn');
  }
});



module.exports = router;

