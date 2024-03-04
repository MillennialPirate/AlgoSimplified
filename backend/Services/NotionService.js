const { json } = require("express");
const fetch = require('node-fetch');

firstNotionCall = async(notionKey, pageId) => {
    var jsonString = '';
    try{
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children/`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${notionKey}`, 
                'Notion-Version': '2021-08-16'
            }
        }); 

        if(!response.ok){
            throw new Error('Failed to fetch page content'); 
        }
        const data = await response.json(); 
        jsonString = JSON.stringify(data);
    }
    catch(error){
        console.error('Error', error); 
        throw error;
    }
    return jsonString;
}

nonFirstNotionCalls = async(notionKey, pageId, startCursor) => {
    var jsonString = '';
    try{
        const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children?start_cursor=${startCursor}`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${notionKey}`, 
                'Notion-Version': '2021-08-16'
            }
        }); 

        if(!response.ok){
            throw new Error('Failed to fetch page content'); 
        }
        const data = await response.json(); 
        jsonString = JSON.stringify(data);
    }
    catch(error){
        console.error('Error', error); 
        throw error;
    }
    return jsonString;
}

getNotionPageContent = async() => {
    const notionKey = ''; 
    const pageId = ''; 

    var next_cursor = '';
    var jsonCombinedString = [];
    
    var firstJsonString = await firstNotionCall(notionKey, pageId); 
    jsonCombinedString.push(firstJsonString);
    next_cursor = JSON.parse(firstJsonString).next_cursor;
    
    while(next_cursor != null){
        var jsonString = await nonFirstNotionCalls(notionKey, pageId, next_cursor); 
        jsonCombinedString.push(jsonString); 
        next_cursor = JSON.parse(jsonString).next_cursor; 
    }
    console.log(jsonCombinedString);
}   

module.exports = {getNotionPageContent};