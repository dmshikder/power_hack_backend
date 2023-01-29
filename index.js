const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mongodb connect

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9qafziu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const billingList = client.db("power_hack").collection("billing-list");

    app.get("/billing-list", async (req, res) => {
      const query = {};
      const cursor = billingList.find(query);
      const allBills = await cursor.toArray();
      res.send(allBills)
    });

    //add bill

    app.post('/add-billing', async(req,res)=>{
        const newBill= req.body;
        console.log('adding new bill', newBill);
        const result = await billingList.insertOne(newBill);
        res.send(result)
    });


    //delete

    app.delete('/delete-billing/:id', async(req,res)=>{
        const id =req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await billingList.deleteOne(query);
        res.send(result);
    })


//    update

app.put('/update-billing/:id', async(req,res)=>{
    const id =req.params.id;
    const updatedUser = req.body;
    const filter = {_id : ObjectId(id)};
    const options = {upsert:true};
    const updatedDoc = {
        $set:{
            fullName:updatedUser.fullName,
            email:updatedUser.email,
            phone:updatedUser.phone,
            paidAmount:updatedUser.paidAmount
        }
    }

    const result = await billingList.updateOne(filter,updatedDoc,options);
    res.send(result)

})



  } 
  finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("power hack backend");
});


app.listen(port, () => {
  console.log("listening to port", port);
});
