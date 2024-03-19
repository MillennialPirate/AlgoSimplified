connectToMongoDb = async(client) => {
    try{
        await client.connect(); 
        console.log('Connected to MongoDb'); 
    }
    catch(err){
        console.error('Error connecting to MongoDb : ', err);
    }
}

module.exports = {connectToMongoDb};