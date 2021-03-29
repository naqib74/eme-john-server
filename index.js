const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const cors =require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors());
const port = 5000



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gaubw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");

  app.post('/addProduct',(req,res) =>{
    const products =req.body;
    productsCollection.insertMany(products)
    .then(result =>{
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req,res) =>{
    productsCollection.find({})
    .toArray( (err,documents) =>{
      res.send(documents);
    })
  })

  app.get('/product/:key', (req,res) =>{
    productsCollection.find({key:req.params.key})
    .toArray( (err,documents) =>{
      res.send(documents[0]);
    })
  })

  app.post('/productsByKeys' , (req,res) =>{
    const productKeys =req.body;
    productsCollection.find({key:{$in:productKeys}})
    .toArray( (err,documents)=>{
      res.send(documents)
    })
  })



   console.log('database connected ')
});


app.listen(process.env.PORT || port)