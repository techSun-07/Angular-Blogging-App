const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//using ejs
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/blogDB");

//Schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Title is Required"] }, //Validation
  imageurl: { type: String, required: [true, "Image Url is Required"] },
  content: { type: String, minlength: [200, "Minimum 200 char is required"] },
  postDate: { type: Date, default: Date.now },
});
const post = mongoose.model("post", postSchema);

let postList = [];

app.get("/", (req, res) => {
  post.find((err, data) => {
    if (err) console.log(err);
    else res.render("home", { posts: data });
  });
});

app.get("/viewpost/:postid", (req, res) => {
  let pid = req.params.postid;
  post.findById(pid,(err, data) => {
    if (err) console.log(err);
    else res.render("viewpost", { post: data });
  });
});
app.get("/editpost/:postid", (req, res) => {
  let pid = req.params.postid;
  post.findById(pid,(err, data) => {
    if (err) console.log(err);
    else res.render("editpost", { post: data, result:''});
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});


app.post("/delpost", (req, res) => {
  // console.log("Delete Post");
  let pid = req.body.pid;
  post.findByIdAndDelete(pid,(err) =>{
    if(!err)
    res.render("newpost", {result:""})
  })
});

app.get("/newpost", (req, res) => {
  res.render("newpost", { result: "" });
});

app.post("/new", (req, res) => {
  console.log(req.body);

  const formdata = new post({
    title: req.body.title,
    imageurl: req.body.image,
    content: req.body.content,
  });
  formdata.save((err) => {
    if (!err) res.render("newpost", { result: "✔ Record Saved " });
    else console.log("Error in Code");
  });
});

app.post('/edit',(req, res)=>{

  let pid = req.body.pid;
  const formdata ={
    title: req.body.title,
    imageurl: req.body.image,
    content: req.body.content,
  };

  post.findByIdAndUpdate(pid, formdata, (err) => {
    if (!err) 
    {
      post.findById(pid,(err, data) => {
      if (!err) 
      res.render("editpost", { post: data, result:'✔ Record Updated'});
    })
    }
    else
    console.log('Error in code');
  });
});


app.listen(port, () => {
  console.log(`Blog Site listening at http://localhost:${port}`);
});
