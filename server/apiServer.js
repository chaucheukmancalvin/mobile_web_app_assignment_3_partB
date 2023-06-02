const express = require('express');
var cors = require('cors')
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.oaodi87.mongodb.net/?retryWrites=true&w=majority";

var LocalData = [];
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

async function getData() {
  currCollection = client.db("Assignment2").collection("person");
  const result = await currCollection.find().toArray();
  return result;
}

async function setData(data) {
  currCollection = client.db("Assignment2").collection("person");
  console.log("data to set: "+data);
  const result = await currCollection.insertMany(data);
  return result;
}

async function deleteData() {
  currCollection = client.db("Assignment2").collection("person");
  const result = await currCollection.deleteMany({});
  return result;
}


// These lines will be explained in detail later in the unit
app.use(express.json());// process json
app.use(express.urlencoded({ extended: true })); 
app.use(cors());
// These lines will be explained in detail later in the unit

app.get('/', (req, res) => {
  res.send('Hello World!')
})
  
app.post('/getData', function (req, res) {
  getData().then((result) => { 
    console.log("get data result: "+JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
});

app.post('/setData', function (req, res) {
  var data = req.body;
  var convertedData =[];
  for(var i=0; i<data.length; i++){
    convertedData.push(JSON.parse(data[i]));
  }
  setData(convertedData).then((result) => { 
    console.log("set data response: "+JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
  
});

app.post('/deleteData', function (req, res) {
  deleteData().then((result) => { 
    console.log(JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
});

  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
});
