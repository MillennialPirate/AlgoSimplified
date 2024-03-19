
const express = require('express');
const bodyParser = require('body-parser');  
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const {MongoClient, ObjectId} = require('mongodb'); 

const app = express();

const notionService = require('./Services/NotionService');
const notionParser = require('./Services/NotionJsonParser');
const tokenHandler = require('./Middlewares/TokenVerification');
const dbService = require('./Database/DbConnection');
const user = require('./Database/Models/User'); 

// connection uri for mongodb
const uri = 'mongodb+srv://siddharthschandran44:<password>@cluster0.93uleuh.mongodb.net/AlgoSimplified?retryWrites=true&w=majority&appName=Cluster0';

// create a new mongo client 
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true}); 

// connect to mongo db server 


app.use(bodyParser.json()); 

app.get("/notion-page", async(req, res) => {
    var jsonStringArr = await notionService.getNotionPageContent()
    var finalJson = notionParser.notionJsonArrayParser(jsonStringArr);
    res.json(finalJson);
}); 

const users = [];

app.post('/signup', async(req, res) => {
    try{

        // check if the email is already being used or not 
        const existingUser = users.find(user => user.email === req.body.email); 
        if(existingUser)
            return res.status(400).json({message : 'Email already exists'}); 

        // hash the password 
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 

        // create a new user object 
        const newUser = {
            email : req.body.email, 
            password : hashedPassword
        }; 
        
        const createdUser = await user.create(newUser);
        // respond with success message 
        res.status(201).json({message : 'User created successfully'}); 
    }
    catch(error){
        console.error('Error creating user:', error);
        res.status(500).json({message : 'Internal Server Error'}); 
    }
});


app.post('/signin', async(req, res) => {
    try{
        // find user by email 
        const user = users.find(user => user.email === req.body.email); 

        if(!user)
            return res.status(404).json({message : 'User not found'}); 
        
        // check password 
        const passwordMatch = await bcrypt.compare(req.body.password, user.password); 

        if(!passwordMatch){
            return res.status(401).json({message : 'Invalid password'}); 
        }

        // generate jwt token 
        const token = jwt.sign({email : user.email}, 'secret', {expiresIn: '1h'}); 
        
        // respond with token 
        res.status(200).json({token}); 
    }
    catch(error){
        res.status(500).json({message : 'Internal Server Error'});
    }
})

// protected profile, can be visited only if the jwt token is valid 
app.get('/profile', tokenHandler.verifyToken, (req, res) => {
    res.status(200).json(req.user);
})

app.listen(5000, () => {
    console.log("Server is up and running");
    dbService.connectToMongoDb(client);
})
