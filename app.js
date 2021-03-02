//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/ticketDB", {useNewUrlParser: true});

const ticketSchema = {
  title: String,
  content: String,
  priority: String,
  status: String
};

const Ticket = mongoose.model("Ticket", ticketSchema);

///////////////////////////////////Requests Targeting all Tickets////////////////////////

app.route("/tickets")

.get(function(req, res){
  Ticket.find(function(err, foundTickets){
    if (!err) {
      res.send(foundTickets);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){

  const newTicket = new Ticket({
    title: req.body.title,
    content: req.body.content
  });

  newTicket.save(function(err){
    if (!err){
      res.send("Successfully added a new ticket.");
    } else {
      res.send(err);
    }
  });
})

.delete(function(req, res){

  Ticket.deleteMany(function(err){
    if (!err){
      res.send("Successfully deleted all tickets.");
    } else {
      res.send(err);
    }
  });
});

////////////////////////////////Requests Targeting A Specific Ticket////////////////////////

app.route("/tickets/:ticketTitle")

.get(function(req, res){

  Ticket.findOne({title: req.params.ticketTitle}, function(err, foundTicket){
    if (foundTicket) {
      res.send(foundTicket);
    } else {
      res.send("No tickets matching that title was found.");
    }
  });
})

.put(function(req, res){

  Ticket.update(
    {title: req.params.ticketTitle},
    {title: req.body.title, content: req.body.content},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Successfully updated the selected ticket.");
      }
    }
  );
})

.patch(function(req, res){

  Ticket.update(
    {title: req.params.ticketTitle},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Successfully updated ticket.");
      } else {
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){

  Ticket.deleteOne(
    {title: req.params.ticketTitle},
    function(err){
      if (!err){
        res.send("Successfully deleted the corresponding ticket.");
      } else {
        res.send(err);
      }
    }
  );
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//Comment new