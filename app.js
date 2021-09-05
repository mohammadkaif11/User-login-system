require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path')
require('./src/database/conn');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const cookieparser = require('cookie-parser');
const auth = require('./src/middleware/auth');
const User = require('./src/models/user');
const cookieParser = require('cookie-parser');
const { Http2ServerRequest } = require('http2');
const { clear } = require('console');
const port = process.env.PORT || 3000;



const static_templates = path.join(__dirname, "./templates/views");
const static_partials = path.join(__dirname, "./templates/partials");


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "hbs");
app.set("views", static_templates);
app.use(cookieParser());
hbs.registerPartials(static_partials)

//home page
app.get("/", (req, res) => {
  res.render("index");
});


// secret page
app.get("/secret", auth ,(req, res) => {
  res.render("secret");
});


//logout page
app.get("/logout", auth ,async(req, res) => {
 try {
   //clearCookie
   res.clearCookie("awt");
   res.render("login");
   await req.user.save();
 } catch (error) {
   res.send(error)
 }
  });
  

app.get("/singup", (req, res) => {
  res.render("singup");
});

app.post("/singup", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.cpassword;
    if (password == confirmpassword) {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
        confirmpassword: confirmpassword
      });
         
      //genrate Token
      const token = await user.genrateToken();
      res.cookie("jwt", token);
      const data = await user.save();
      res.status(201).render("index");
    } else {
      res.send("password not matching");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});


// login page
app.get("/login", (req, res) => {
  res.render("login");
});

// login page post request
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const data = await User.findOne({ email: email });
     
    //campare hashpassword  and user enter password
    if (!data && !bcrypt.compareSync(password, data.passwordhash)) {
      res.status(400).send("INvalid details")
    } else {
      const token = await data.genrateToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60000),
        httpOnly: true
      });
      res.render("index");
    }
  } catch (error) {
    res.status(400).send("invalidemail")
  }
});


app.listen(port, () => {
  console.log(`app is listen on ${port}`)
});
