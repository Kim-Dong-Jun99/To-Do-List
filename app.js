//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const assert = require("assert")
// const date = require(__dirname + "/date.js");
const url = require(__dirname+"/url.js");
const app = express();
const URL = url.getUrl();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect(URL);

const itemSchema = {
  name:String
};

const Item = mongoose.model("Item", itemSchema);


let items = [];
let workItems = [];

const item1 = new Item({
  name:"Welcome to your todo list"
});

const item2 = new Item({
  name:"Hit the + button to add a new item"
});

const item3 = new Item({
  name:"<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, function(err){
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("succesfully saved");
//   }
// })

app.get("/", function(req, res) {

  // const day = date.getDate();

  Item.find({}, function (err, result) {

    if (err) {
      console.log(err)
    }else{
      items = result;
      // console.log("2"+workItems);
      // for (let resultElement of result) {
      //   console.log(resultElement);
      // }
      // console.log("#"+workItems.length);
    }

    // console.log("1"+workItems);
    res.render("list", {listTitle: "Today", newListItems: items});
  });
});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    const newItem = new Item({
      name:item
    });
    newItem.save(function(err){
      if (err) {
        console.log(err);
      } else {
        console.log("successfully added");
      }
      // items.push(item);
      res.redirect("/");
    });
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});


app.post("/delete", function (req, res) {
  console.log(req.body);
  // Item.deleteOne({_id:req.body.checkBox}, function (err){
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     console.log("successfully deleted");
  //   }
  //   res.redirect("/");
  // })

  Item.findByIdAndRemove(req.body.checkBox, function (err) {
    if (!err) {
      console.log("Successfully deleted");
      res.redirect("/");
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
