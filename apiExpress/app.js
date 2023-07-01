const express= require('express')
const mongodb=require('mongodb')

const app = express();
const MongoClient=mongodb.MongoClient

const mongoURL='mongodb+srv://kurraomsairam2:%40Bhi1998@cluster0.1wdufo0.mongodb.net/my-databases?retryWrites=true&w=majority&authMechanism=DEFAULT'

app.use(express.json())

//Post
app.post('/api/items',async (req,res)=>{
    try{
        const client=await MongoClient.connect(mongoURL)
        const db=client.db()
        const newItem =req.body
        const result=await db.collection('items').insertOne(newItem)
        res.status(200).json(newItem)
        client.close()
    }catch(error){
        console.error(error)
        res.status(500).json({message:'Internal server error'})
    }
});


//Get
app.get('/api/items', async (req, res) => {
    try {
      const client = await MongoClient.connect(mongoURL);
      const db = client.db();
      const items = await db.collection('items').find({}).toArray();
      client.close();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//Put
app.put('/api/items/:id', async (req, res) => {
    try {
      const itemId = req.params.id;
      const updatedItem = req.body;
  
      const client = await MongoClient.connect(mongoURL);
      const db = client.db();
      const result = await db.collection('items').updateOne({ _id: new mongodb.ObjectId(itemId) }, { $set: updatedItem });
      client.close();
  
      if (result.modifiedCount === 0) {
        res.status(404).json({ message: 'Item not found' });
      } else {
        res.json({ message: 'Item updated successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

//Delete
app.delete('/api/items/:id', async (req, res) => {
    try {
      const itemId = req.params.id;
  
      const client = await MongoClient.connect(mongoURL);
      const db = client.db();
      const result = await db.collection('items').deleteOne({ _id: new mongodb.ObjectId(itemId) });
      client.close();
  
      if (result.deletedCount === 0) {
        res.status(404).json({ message: 'Item not found' });
      } else {
        res.json({ message: 'Item deleted successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


const port = 3000
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})