const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const monitor = require("nodemon/lib/monitor");
const _ = require("lodash");
require('dotenv').config()
const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

const url =process.env.DB_HOST;
//Connecting to database
mongoose.connect(url, { useNewUrlParser: true });

//ITEM SCHEMA
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength:2,
    maxlength:15
},
});

//mongoose model
const Item = mongoose.model("item", itemsSchema);

//task1
const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.!",
});

const defaultItems = [item1, item2];




app.get("/", (req, res) => {

  Item.find({}, (err, foundItems) => {
    
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems,(err)=>{
          if(err){
              console.log(err);
          }else{
              console.log("Succesfully");
          }
      })
      res.redirect('/'); 
    }else{
        res.render("list", { listTitle: "Today", newListItem: foundItems });
    }

    
  });
});


let port = process.env.PORT;
if(port == null || port ==""){
  port = 3000;
}

app.listen(port, () => {
  console.log("Server has started successfully!");
});

// '/' home route'a gonderilen post requestleri
app.post("/", (req, res) => {
  var itemName = req.body.newItem;

  const item = new Item({
      name:itemName
  })

  item.save();

  res.redirect("/");
});


//DELETE
app.post('/delete',(req,res)=>{
       const checkedItemId = req.body.checkbox;

       Item.findByIdAndDelete(checkedItemId,(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log("Succesfully deleted");
            res.redirect('/');
        }
       
    })
})