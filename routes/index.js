var express = require('express');
var router = express.Router();

const user = require("../model/userModel")
const Task = require("../model/taskModel")


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home', { title: 'Home Page' });
});

router.get('/nav', function(req, res, next) {
  res.render('nav');
});

router.get('/usererror', function(req, res, next) {
  res.render('usererror');
});

router.get('/passerror', function(req, res, next) {
  res.render('passerror');
});

/* To Show The Signin Page */
router.get('/signin', function (req, res, next) {
  res.render('signin', { title: 'Signin' });
});

/* To Show The Signup Page */
router.get('/signup', function (req, res, next) {
  res.render('signup', { title: 'Signup' });
});


/* To Post Signup Page Data */
router.post('/signup', function (req, res, next) {
  user.create(req.body)
    .then((createUser) => {
      res.redirect("/signin");
    })
    .catch(err => res.send(err));
});

 /* To Post Signin Page Data */
router.post('/signin', function (req, res, next) {
  const { username, password } = req.body;
  user.findOne({username})
    .then((foundUser) => {

        if(!foundUser){
            // return res.send("User not found <a href='/signin'>Go Back</a>")
            return res.redirect("/usererror")
        }
        if(password !== foundUser.password){
            return res.redirect("/passerror")
        }
        // res.redirect("/profile/" + foundUser.username  )
        res.redirect("/create/" + foundUser._id);

  }).catch((err) => res.send("NOT EMPTY"))
});



// This Route For Profile Page.
router.get("/create/:id", function (req, res, next) {
  user.findById(req.params.id)
      .then((founduser) => {
        res.render("create", { 
            title: founduser.username, 
            user: founduser
          });
      })
      .catch((err) => res.send(err));
});

// This Route For Delete User.
router.get("/delete/:id", function (req, res, next) {
  user.findByIdAndDelete(req.params.id)
      .then((founduser) => {
        res.redirect("/signin")
      })
      .catch((err) => res.send(err));
});

// This Route For Update Page.
router.get("/updateUser/:id", function (req, res, next) {
  user.findById(req.params.id)
      .then((founduser) => {
        res.render("update", { 
            title: founduser.username, 
            user: founduser
          });
      })
      .catch((err) => res.send(err));
});

// This Route For Show Update Page.
router.post("/updateUser/:id", function (req, res, next) {
  user.findByIdAndUpdate(req.params.id, req.body)
      .then((founduser) => {
          res.redirect("/create/" + founduser._id);
      })
      .catch((err) => res.send(err));
});

// For Logout Page
router.get("/logout", function (req, res, next) {
  res.redirect("/signin");
});




/* -------------- To do Functionality -------------------- */

router.get('/create', function (req, res, next) {
  res.render('create');
});


router.post('/create', function (req, res, next) {
  const { title, desc, status } = req.body;

  if (title.length < 4 || desc.length < 15) return res.send("<h2>The length of your title and desc must be at least more than 4 and 15.</br><a href='/create'>BACK</a></h2>");

  else{
    Task.create({ title, desc, status})
      .then(() => {
        res.redirect("/show");
      })
      .catch((err) => {
        res.send(err);
      });
  };

});


router.get('/show', function (req, res, next) {

  Task.find()
    .then((tasks) => {
      res.render('show', { tasks });
    })
    .catch((err) => {
      res.send(err)
    });
});

router.get('/delete/:id', function (req, res, next) {

  Task.findByIdAndDelete(req.params.id)
    .then((task) => {
      res.redirect('/');
    })
    .catch((err) => {
      res.send(err);
    });


});

router.get("/updateTask/:id", function (req, res, next) {
  const id = req.params.id;

  user.findById(req.params.id)
    .then((task) => {
      res.render("updateTask", { task });
    })
    .catch((err) => {
      res.send(err)
    });

});

router.post('/updateTask/:id', function (req, res, next) {

  const id = req.params.id;

  const { title, desc } = req.body;

  user.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      res.send(err)
    });

});

module.exports = router;
