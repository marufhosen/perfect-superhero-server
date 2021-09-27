const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const port = 8080;

app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lvals.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const heroesCollection = client.db("SuperHeroDB").collection("superHeroes");
  app.post("/addSuperhero", (req, res) => {
    const newHero = req.body;
    heroesCollection.insertOne(newHero).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  app.get("/superHeroes/:id", (req, res) => {
    heroesCollection
      .find({ superheroId: req.params.id })
      .toArray((err, docs) => {
        res.send(docs[0]);
      });
  });

  //get products by id
  //   app.get("/product/:id", (req, res) => {
  //     productId = new ObjectId(req.params.id);
  //     productsCollection.find({ _id: productId }).toArray((err, documents) => {
  //       res.send(documents[0]);
  //     });
  //   });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT || port);
