//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const assert = require("assert")
const _ = require("lodash")
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

const listSchema = {
  name:String,
  items:[itemSchema]
};


const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List",listSchema);


let items = [];

app.get("/", function(req, res) {


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
  const list = req.body.list;
  const newItem = new Item({
    name:item
  });

  if (list === "Today") {
    newItem.save(function (error) {
      if (!error) {
        console.log("item successfully added");
        res.redirect("/");
      }
    });
  } else {
    List.findOne({name: list}, function (error, result) {
      if (error) {
        console.log(error);
      } else {
        result.items.push(newItem);
        result.save(function (error) {
          if (!error) {
            console.log("item successfully added");
            res.redirect("/" + list);
          }
        });
      }
    });
  }


});




app.get("/:route", function(req, res){
  // res.render("list",{listTitle:req.params.route, newListItems:[]})
  const route = _.capitalize(req.params.route);
  console.log(route);
  List.findOne({name: route}, function (error, result) {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      if (result) {
        console.log("list found");
        res.render("list",{listTitle:route, newListItems: result.items})
      }else {
        const newList = new List({
          name: route,
          items:[]
        });
        newList.save(function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("list created successfully");
          }
        });
        res.render("list",{listTitle:route, newListItems: []});
      }

    }
  });
})





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
  const list = req.body.list;

  if (list === "Today") {

    Item.findByIdAndRemove(req.body.checkBox, function (err) {
      if (!err) {
        console.log("Successfully deleted");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: list}, {$pull: {items: {_id: req.body.checkBox}}}, function (err, results) {
      if (!err) {
        console.log("Successfully deleted");
        res.redirect("/" + list);
      }
    });
  }

});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
