var express = require('express');
var router = express.Router();

const user = require("../model/userModel")
const Task = require("../model/taskModel")

var fs = require('fs');
var excel = require('excel4node');

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

router.get('/create', async function(req, res, next) {
  let data = await user.find();
  res.render('create',{data});
});

router.post('/create', function (req, res, next) {
  const { title, desc, status , user_id } = req.body;

  if (title.length < 4 || desc.length < 15) return res.send("<h2>The length of your title and desc must be at least more than 4 and 15.</br><a href='/create'>BACK</a></h2>");

  else{
    Task.create({ title, desc, status,user_id})
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
    .populate("user_id")
    .then((tasks) => {
      res.render('show', { tasks });
    })
    .catch((err) => {
      res.send(err)
    });
});

router.get('/delete/:id', function (req, res, next) {

  console.log(":: ids :: 0",req.params.id);

  Task.findByIdAndDelete(req.params.id)
    .then((task) => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(":: err : 0", err);
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

/**
 * @description 
 */



//excel file config---
var workbook = new excel.Workbook();
var worksheet = workbook.addWorksheet('User');
var worksheet1 = workbook.addWorksheet('Task');
var style = workbook.createStyle({
	font: {
	  color: '#EA3A14',
	  size: 18
	},
});

var styleForData = workbook.createStyle({
	font: {
	  color: '#47180E',
	  size: 12
	},
	alignment: {
	  wrapText: true,
	  horizontal: 'center',
	},
});

//Tab 1 headers | User
worksheet.cell(1,1).string('name').style(style);
worksheet.cell(1,2).string('email').style(style);
worksheet.cell(1,3).string('number').style(style);

//Tab 2 headers | Task
worksheet1.cell(1,1).string('title').style(style);
worksheet1.cell(1,2).string('desc').style(style);
worksheet1.cell(1,3).string('status').style(style);
worksheet1.cell(1,4).string('Assigned to user').style(style);


//Some logic
async function generateExcelSheetUser(array,worksheet){
  let row=2;//Row starts from 2 as 1st row is for headers.
  for(let i in array){
    let o=1;

    //This depends on numbers of columns to fill.
    worksheet.cell(row,o).string(array[i].username).style(styleForData);
    worksheet.cell(row,o+1).string(array[i].email).style(styleForData);
    worksheet.cell(row,o+2).number(array[i].number).style(styleForData);

    row=row+1;
  }
}

async function generateExcelSheetTask(array,worksheet){
	let row=2;//Row starts from 2 as 1st row is for headers.
	for(let i in array){
	  let o=1;
	  //This depends on numbers of columns to fill.
	  worksheet.cell(row,o).string(array[i].title).style(styleForData);
	  worksheet.cell(row,o+1).string(array[i].desc).style(styleForData);
	  worksheet.cell(row,o+2).string(array[i].status).style(styleForData);
	  worksheet.cell(row,o+2).string(array[i].user_id.username).style(styleForData);
  
	  row=row+1;
	}
}


router.get('/download-excel-data', async function (req, res, next) { 

  let userData = await user.find();
  let taskData = await Task.find().populate("user_id");
  
   await  generateExcelSheetUser(userData,worksheet)
   await generateExcelSheetTask(taskData,worksheet1)

    await workbook.write('./Excel.xlsx')
  	res.download('./Excel.xlsx'); 
});




module.exports = router;
