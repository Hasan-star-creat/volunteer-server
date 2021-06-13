const express = require("express");
cors = require("cors");
const bodyParser = require('body-parser');
require("dotenv").config();
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require("mongodb").MongoClient;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 5050;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvh8x.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLL}`);
console.log('db connection successfully')

  app.get("/events", (req, res) => {
    eventCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
  });
  
  
   app.post('/addEvent', (req, res) => {
       const newEvent = req.body;
       eventCollection.insertOne(newEvent)
       .then(result => {
         console.log('insertedCount:', result.insertedCount)
         res.send(result.insertedCount > 0)
       })

       app.delete('/deleteEvent/:id', (req, res) => {
         console.log("delete click id", req.params.id);
         const id = ObjectID(req.params.id);
         eventCollection.deleteOne({ _id: id})
         .then(documents => res.send(!!documents.value))
       });
   });

   
  
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.listen(port)
   

