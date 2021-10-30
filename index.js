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
