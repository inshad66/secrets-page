//jshint esversion:6
require('dotenv').config()
const express = require ("express");
const bodyParser = require ("body-parser");
const ejs = require ("ejs");
const mongoose = require ("mongoose");
var encrypt = require("mongoose-encryption");

const app = express ();

const uri = 'mongodb+srv://inshadbinbasheer:mazin@cluster0.dg3gtla.mongodb.net/?retryWrites=true&w=majority'
async function connect (){
    try {
        await mongoose.connect(uri);
        console.log("connected to mongodb");
    } catch(error) {
        console.error(error);
    }
}
connect();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended:true }));

const userSchema = new mongoose.Schema({
    email: { type: String }, // fix here
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET,  encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", async function(req , res){
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    try {
      await newUser.save();
      res.render("secrets");
    } catch (error) {
      console.log(error);
    }
  });

  app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
        .then((foundUser) => {
            if (foundUser && foundUser.password === password) {
                res.render("secrets");
            } else {
                // Handle invalid login
            }
        })
        .catch((err) => {
            console.log(err);
        });
});


  

app.listen(3000, function(){
    console.log("ported in 3000");
});
