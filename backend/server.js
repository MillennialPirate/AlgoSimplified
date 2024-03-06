
const express = require('express'); 
const app = express();
const notionService = require('./Services/NotionService');
const notionParser = require('./Services/NotionJsonParser');


app.get("/notion-page", async(req, res) => {
    var jsonStringArr = await notionService.getNotionPageContent()
    var finalJson = notionParser.notionJsonArrayParser(jsonStringArr);
    res.json(finalJson);
}); 

app.listen(5000, () => {
    console.log("Server is up and running");
})
