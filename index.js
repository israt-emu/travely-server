const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4g4am.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//function to connect database
async function run() {
  try {
    await client.connect();
    const database = client.db("travely-database");
    const offerCollection = database.collection("offerings");
    const visitorCollection = database.collection("visitors");

    //get offerings
    app.get("/offerings", async (req, res) => {
      const cursor = offerCollection.find({});
      const tours = await cursor.toArray();
      res.send(tours);
    });

    //get single offer by id
    app.get("/offerings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const tour = await offerCollection.findOne(query);
      res.send(tour);
    });
    //post visitors
    app.post("/visitors", async (req, res) => {
      const visitor = req.body;
      const result = await visitorCollection.insertOne(visitor);
      res.json(result);
    });
    //get visitors by email
    app.get("/visitors/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = visitorCollection.find(query);
      const visitor = await cursor.toArray();
      res.send(visitor);
    });
    //get all visitors
    app.get("/visitors", async (req, res) => {
      const cursor = visitorCollection.find({});
      const visitors = await cursor.toArray();
      res.send(visitors);
    });
    //delete visitors order
    app.delete("/visitors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await visitorCollection.deleteOne(query);
      res.json(result);
    });
    //update status
    app.put("/visitors/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "Approved",
        },
      };
      const result = await visitorCollection.updateOne(
        query,
        updateDoc,
        options
      );
      res.json(result);
    });
    //post offerings
    app.post("/offerings", async (req, res) => {
      const newOffer = req.body;
      const result = await offerCollection.insertOne(newOffer);
      res.json(result);
    });

    console.log("connected");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
