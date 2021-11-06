const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("doctors portal");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mil2w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connected");

    const database = client.db("doctors_portal");
    const appointmentCollection = database.collection("appointment");

    // appointment get
    app.get("/appointment", async (req, res) => {
      const email = req.query.email;
      const date = new Date(req.query.date).toLocaleDateString();
      // const date = req.query.date;
      console.log(date);
      const query = { email: email, date: date };
      const cursor = appointmentCollection.find(query);
      console.log(query);
      const appointment = await cursor.toArray();
      res.send(appointment);
    });
    //appointment post
    app.post("/appointment", async (req, res) => {
      const appointment = req.body;
      // console.log(appointment);
      const result = await appointmentCollection.insertOne(appointment);
      // console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("running on port", port);
});
