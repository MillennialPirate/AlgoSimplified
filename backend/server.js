
const express = require('express'); 
const app = express();
const notionService = require('./Services/NotionService');


app.get("/notion-page", async(req, res) => {
    notionService.getNotionPageContent()
}); 

app.listen(5000, () => {
    console.log("Server is up and running");
})
