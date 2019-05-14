var request = require('supertest')
var app = require('../app')
const expect = require('chai').expect;
var chai = require('chai')
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var authenticatedUser = request.agent(app);

///////////////////////////////////////////////////////
//Testing:                                           //
// In order to run testing please run "npm test"     //
//The tests should statrt to be carried out.         //
// if there are any errors please run npm install    //
// this will install any modules which are required  //
///////////////////////////////////////////////////////


//check main index page
describe('Main index', function () {
    it("index page", function (done) {
        request(app).get("/")
            .expect(200, done)
    })
})
// //check about us page shows
describe('About page', function () {
    it("Display about us page", function (done) {
        request(app).get("/about")
            .expect(200, done)
})
})

// //check login forms shows
describe('Login page', function () {
    it("Display sign in page", function (done) {
        request(app).get("/signIn")
            //console.log(app._route)
            //console.log(app.response.getHeader)
            //console.log(app.response.headersSent)
            .expect(200, done)
    })
})

// //LOGIN -----------

// //empty 
describe('Login request: email empty, password is empty', function () {
    it("User is not logged in", function (done) {
        request(app).post("/login")
            .send({
                email: '',
                password: ''
            })
            .expect(function (response) {
                expect(response.statusCode).to.equal(200);
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');

            })
            .end(done)
    });
})

//invlid email
describe('Login request: not an email empty, password is empty', function() {
    it("User is not logged in", function(done) {
        request(app).post("/login")
            .send({
                email: 'vinehghela',
                password: 'password'
            })
            .expect(function(response) {
                expect(response.statusCode).to.equal(200);
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');

              })
            .end(done)
            });
})

// //user does not exist
describe('Login request: user does not exist', function() {
    it("User is not logged in", function(done) {
        request(app).post("/login")
            .send({
                email: 'test@gmail.com',
                password: 'asdfgh'
            })
            .expect(function(response) {
                expect(response.statusCode).to.equal(200);
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');

              })
            .end(done)
            });
})

// //incorrect password
describe('Login request: email exists, password is incorrct', function() {
    it("User is not logged in", function(done) {
        request(app).post("/login")
            .send({
                email: 'vineshghela@gmail.com',
                password: 'jhgfd'
            })
            .expect(function(response) {
                expect(response.statusCode).to.equal(200);
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');

              })
            .end(done)
            });
})

// // user name is wrong and password is correct
describe('Login request: email does exists, password is correct', function() {
    it("User is not logged in", function(done) {
        request(app).post("/login")
            .send({
                email: 'vineshla@gmail.com',
                password: 'password'
            })
            .expect(function(response) {
            expect(response.statusCode).to.equal(200);
            expect(require.body).not.to.be.null;
            expect(response.body).to.be.an('object');

          })
        .end(done)
        });
})

// user name and password is correct
describe('Login request: email exists, password is correct', function() {
    it("User is logged in", function(done) {
        request(app)
            .post('/login')
            .send({
                email: 'vineshghela@gmail.com',
                password: 'password'
            })
            .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', '/home');
            expect(require.body).not.to.be.null;
            expect(response.body).to.be.an('object');

          })
        .end(done)
        });
    })


describe('Home user not user session is set/ no access to an logged in page', function() {
    it("User is not allowed in due to session being null", function(done) {
        request(app).get("/home")
            .send({
                email: ''
            })
        .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', 'AccessDenied');
            expect(require.body).not.to.be.null;

          })
        .end(done)
  });
})

describe('Home user not user session is set/ no access to an logged in page', function() {
    //req.session = {};
    it("User is not allowed in due to session being null", function(done) {
        request(app).get("/home")
            .send({
                email: 'vineshghela@gmail.com'
            })
            .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', 'AccessDenied');
            expect(require.body).not.to.be.null;

          })
        .end(done)
  });
})

// //the login detials of the user account to check
const loginDetils = {
    email: 'vineshghela@gmail.com',
    password: 'password'
}
//login user in call back method
before(function(done) {
    authenticatedUser
        .post('/login')
        //credentials passed fom login Detials above.
        .send(loginDetils)
        .end(function(err, response) {
            expect(response.statusCode).to.equal(302);
            expect('Location', '/home');
            done();
        });
});
//check that when an authorised user is logged in that they get the home page
describe('GET /home', function(done) {
  it('should return a 200 response if the user is logged in and display home', function(done) {
        authenticatedUser.get('/home')
            .expect(function(response) {
                expect(response.statusCode).to.equal(200);
                expect(require.body).not.to.be.null;
                expect('Location', '/home');
                expect(response.body).to.be.an('object');
            })
            .end(done)
    });
  it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
        request(app).get('/home')
        .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', 'AccessDenied');
            expect(require.body).not.to.be.null;

          })
        .end(done)
  });
})

// //
describe('GET /profile', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in and display the profile page', function(done) {
        authenticatedUser.get('/profile')
        .expect(function(response) {
            expect('Location', '/profile');
            expect(require.body).not.to.be.null;
            expect(response.body).to.be.an('object');            
            expect(JSON);
        })
        .end(done)
      })
      it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
        request(app).get('/home')
        .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', 'AccessDenied');
            expect(require.body).not.to.be.null;

          })
        .end(done)
});
});

 describe('GET /catagory', function(done) {
     //addresses 1st bullet point: if the user is logged in we should get a 200 status code
     it('should return a 200 response if the user is logged in and disply the catagory page', function(done) {
         authenticatedUser.get('/catagory')
            .expect(200)
            .expect(function(response) {
                expect('Location', '/catagory');
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');              
                expect(JSON);
          })
          .end(done)
        })
        it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
            request(app).get('/home')
            .expect(function(response) {
                expect(response.statusCode).to.equal(302);
                expect(response).to.have.header('Location', 'AccessDenied');
                expect(require.body).not.to.be.null;

              })
            .end(done)
 });
});

describe('GET /allergy', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in and display the allergy page', function(done) {
        authenticatedUser.get('/allergy')
            .expect(function(response) {
                expect('Location', '/allergy');
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
          })
          it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
            request(app).get('/home')
            .expect(function(response) {
                expect(response.statusCode).to.equal(302);
                expect(response).to.have.header('Location', 'AccessDenied');
                expect(require.body).not.to.be.null;

              })
            .end(done)
});
});

describe('GET /menuForm', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in and display the menu form page', function(done) {
        authenticatedUser.get('/menuForm')
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
               })
               it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
                request(app).get('/home')
                .expect(function(response) {
                    expect(response.statusCode).to.equal(302);
                    expect(response).to.have.header('Location', 'AccessDenied');
                    expect(require.body).not.to.be.null;

                  })
                .end(done)
});
});

describe('GET /menuList', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in should show the menu items', function(done) {
        authenticatedUser.get('/menuList')
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
            })
            it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
                request(app).get('/home')
                .expect(function(response) {
                    expect(response.statusCode).to.equal(302);
                    expect(response).to.have.header('Location', 'AccessDenied');
                    expect(require.body).not.to.be.null;

                  })
                .end(done)
});
});

describe('GET /offer', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in and display the offer page', function(done) {
        authenticatedUser.get('/offer')
        .expect(function(response) {
          expect(require.body).not.to.be.null;
          expect(response.body).to.be.an('object');
          })
          .end(done);
    });
    it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
        request(app).get('/home')
        .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', 'AccessDenied');
            expect(require.body).not.to.be.null;

          })
        .end(done)
});
});



describe('GET /dashboard', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in and display the dashboard page', function(done) {
        authenticatedUser.get('/dashboard')
            .expect(200)
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
})
it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
    request(app).get('/home')
    .expect(function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response).to.have.header('Location', 'AccessDenied');
        expect(require.body).not.to.be.null;

      })
    .end(done)
});
});


describe('GET /addNewUser', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in and display add new user page', function(done) {
        authenticatedUser.get('/addNewUser')
            .expect(200)
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
})
it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
    request(app).get('/home')
    .expect(function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response).to.have.header('Location', 'AccessDenied');
        expect(require.body).not.to.be.null;

      })
    .end(done)
});
});

var orderId ={productID1:'1'}
describe('POST /update1/:prodStatus1', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 302 response if the user is logged in update the product status to 1 and return redirect back to home', function(done) {
        authenticatedUser.post('/update1/1111111111111111')
            .expect(302)
            .set(orderId)
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
})
it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
    request(app).get('/home')
    .expect(function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response).to.have.header('Location', 'AccessDenied');
        expect(require.body).not.to.be.null;

      })
    .end(done)
});
});

var orderId ={
    productID2:'2'
}
describe('POST /update2/:prodStatus2', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 302 response if the user is logged in update the product status to 2 and return redirect back to home', function(done) {
        authenticatedUser.post('/update2/1111111111111111')
            .expect(302)
            .set(orderId)
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
})
it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
    request(app).get('/home')
    .expect(function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response).to.have.header('Location', 'AccessDenied');
        expect(require.body).not.to.be.null;

      })
    .end(done)
});
});


var orderId ={
    productID2:'3'
}
describe('POST /update3/:prodStatus3', function(done) {
    //addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 302 response if the user is logged in update the product status to 3 and return redirect back to home', function(done) {
        authenticatedUser.post('/update3/1111111111111111')
            .expect(302)
            .set(orderId)
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
})
it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
    request(app).get('/home')
    .expect(function(response) {
        expect(response.statusCode).to.equal(302);
        expect(response).to.have.header('Location', 'AccessDenied');
        expect(require.body).not.to.be.null;

      })
    .end(done)
});
});



describe('POST Allergy/ new allergy', function(done) {
    it("User is not logged in", function(done) {
        authenticatedUser.post("/addNewAllergy")
            .send({
                allergyName: 'TESTTTing'
            })
            .expect(302)
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
    })
    it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
        request(app).get('/home')
        .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', 'AccessDenied');
            expect(require.body).not.to.be.null;

          })
        .end(done)
    });
    });


describe('POST addNewCatagory/ new catagory', function(done) {
    it("User is not logged in", function(done) {
        authenticatedUser.post("/addNewCatagory")
            .expect(302)
            .send({
                catName: 'TESTTTing',
                catImage:'i is a test'

            })
            .expect(302)
            .expect(function(response) {
                expect(require.body).not.to.be.null;
                expect(response.body).to.be.an('object');
            })
            .end(done);
    })
    it('should return a 302 status code  and redirect to /AccessDenied if user is not logged in ', function(done) {
        request(app).get('/home')
        .expect(function(response) {
            expect(response.statusCode).to.equal(302);
            expect(response).to.have.header('Location', 'AccessDenied');
            expect(require.body).not.to.be.null;

          })
        .end(done)
    });
    });