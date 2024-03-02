const express = require('express')
const app = express(); 
const notionKey = ''; 
const pageId = '';

app.get("/notion-page", async(req, res) => {
    try{
        const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${notionKey}`, 
                'Notion-Version': '2021-05-12'
            }
        }); 

        if(!response.ok){
            throw new Error('Failed to fetch page content'); 
        }
        const data = await response.json(); 
        res.json(data); 
    }
    catch(error){
        console.error('Error', error); 
        res.status(500).json({error: 'Failed to fetch page content'});
    }
}); 

app.listen(5000, () => {
    console.log("Server is up and running");
})