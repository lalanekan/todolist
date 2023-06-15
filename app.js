const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = {
    name: String
};

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<---Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];


const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/", function(req, res){
    Item.find().then(function(founditems){

if(founditems.length === 0){
    Item.insertMany(defaultItems)
.then(function(){
    console.log("Successfully saved defult items to DB");
})
.catch(function (err) {
    console.log(err);
  });
  res.redirect("/");
}else{
    res.render("list", {listTitle: "Today", newListItems: founditems});
}
});

});



// app.get("/:customListName", function(req, res){
//     const customListName = req.params.customListName;

//     List.findOne({name: customListName}).then(function(){
//         (err, foundList)
//             if(!err){
//                 if(!foundList){
//                     console.log("Doesn't exist!");
//                 }else{
//                     console.log('Exist!');
//                 }
//             }
        
    
//     })
       

//     const list = new list({
//         name: customListName,
//         items: defaultItems
//     });

//     list.save();
// });

app.post("/", function (req,res) {

   const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId).then(function(){
        console.log("Successfully deleted checked item.");
        res.redirect("/");
    });
    
});



app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server stated on port 3000")
});