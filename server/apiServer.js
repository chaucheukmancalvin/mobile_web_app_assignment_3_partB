const express = require('express');
//var formidable = require('formidable');
var cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@cluster0.c163bpz.mongodb.net/?retryWrites=true&w=majority";

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

async function getAllEventData() {
  currCollection = client.db("Assignment3").collection("event");
  const result = await currCollection.find().toArray();
  return result;
}

async function getLatestEventData() {
  currCollection = client.db("Assignment3").collection("event");
  const result = await currCollection.find().sort({ id: -1 }).limit(1).toArray();
  return result;
}

async function getEventDataByUser(data) {
  currCollection = client.db("Assignment3").collection("event");
  const result = await currCollection.find(data).toArray();
  return result;
}

async function getEventDataByID(data) {
  currCollection = client.db("Assignment3").collection("event");
  const result = await currCollection.find(data).toArray();
  return result;
}

async function setNewEventData(data) {
  currCollection = client.db("Assignment3").collection("event");
  console.log("data to set: "+data);
  const result = await currCollection.insertMany(data);
  return result;
}

async function editEventDataByID(data) {
  currCollection = client.db("Assignment3").collection("event");
  console.log("data to set: "+data);
  const result = await currCollection.updateOne(data[0],{$set:data[1]});
  return result;
}

async function deleteData() {
  currCollection = client.db("Assignment3").collection("event");
  const result = await currCollection.deleteMany({});
  return result;
}

async function deleteEventDataByID(data) {
  currCollection = client.db("Assignment3").collection("event");
  const result = await currCollection.deleteMany(data);
  console.log(result);
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
  
app.post('/getAllEventData', function (req, res) {
  getAllEventData().then((result) => { 
    console.log("get data result: "+JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
});
app.post('/getLatestEventData', function (req, res) {
  getLatestEventData().then((result) => { 
    console.log("get data result: "+JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
});

app.post('/getEventDataByUser', function (req, res) {
  var data = req.body;
  console.log(data);
  getEventDataByUser(data).then((result) => { 
    console.log("get data result: "+JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
});

app.post('/getEventDataByID', function (req, res) {
  var data = req.body;
  console.log(data);
  getEventDataByID(data).then((result) => { 
    console.log("get data result: "+JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
});

app.post('/setNewEventData', function (req, res) {
  var data = req.body;
  var convertedData =[];
  for(var i=0; i<data.length; i++){
    console.log(data[i]);
    convertedData.push(JSON.parse(data[i]));
  }
  setNewEventData(convertedData).then((result) => { 
    console.log("set data response: "+JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
  
});

app.post('/editEventDataByID', function (req, res) {
  var data = req.body;
  console.log(data);
  var convertedData =[];
  for(var i=0; i<data.length; i++){
    console.log(data[i]);
    convertedData.push(JSON.parse(data[i]));
  }
  editEventDataByID(convertedData).then((result) => { 
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

app.post('/deleteEventDataByID', function (req, res) {
  data = req.body;
  console.log(data);
  deleteEventDataByID(data).then((result) => { 
    console.log(JSON.stringify(result));
    res.send( JSON.stringify(result) );}
  );
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique filename by adding a timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  }
});
const staticPath = path.join(__dirname, '../notificationApp/www');
app.use(express.static(staticPath));
const upload = multer({ storage: storage });
app.post('/uploadNewEventImage', upload.array('newEventImage'), (req, res) => {
  console.log(req.files);
  console.log(req.body.fileName);
  // Access the uploaded file using req.file
  if (req.files.length>0) {
    //const originalName = req.file.originalname;
    for(var i=0; i<req.files.length; i++){
      const fileName = (typeof req.body.fileName== "object"? req.body.fileName[i] : req.body.fileName);
      const tempPath = req.files[i].path;
      const targetPath = path.join(__dirname, '../notificationApp/www/img', fileName); // Set the target path

      // Move the file to the target path
      fs.rename(tempPath, targetPath, (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error occurred while saving the file.');
        } else {
          
        }
      });
    }
    res.status(200).send('file save successfully');
  } else {
    console.log('No file uploaded.');
    res.status(400).send('No file uploaded.');
  }
  
});

app.post('/deleteImageInFolderByID', function (req, res) {
  var data = req.body;
  var filePath = path.join(__dirname, '../notificationApp/www/img', data.image); // Set the target path
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlinkSync(filePath);
    res.status(200).send( "Image Delete Successfully" );
  }else {
    
    res.status(404).send('File not found.');
  }
});


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000'); // Replace with your client-side origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
});
