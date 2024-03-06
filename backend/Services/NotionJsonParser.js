

notionJsonArrayParser = (jsonStringArr) => {
    var topicModels = []; 
    var problems = [];
    var problemTopic = [];
    jsonStringArr.forEach(jsonString => {
        var blobContent = JSON.parse(jsonString); 
        
        blobContent.results.forEach(blob => {
            if(blob.type == "heading_2"){
                topicModels.push({
                    topic: blob.heading_2.text[0].text.content,
                    problem: [] 
                });
                
                if(problems.length != 0)
                    problemTopic.push(problems);
                problems = []; 
            }

            if(blob.type == "to_do"){
                problems.push({
                    question : blob.to_do.text[0].text.content, 
                    url : '', 
                    status : false, 
                    description : ""
                }); 
                
            }
        })
    });
    problemTopic.push(problems);
    //console.log(topicModels.length + " " + problemTopic.length);
    var topicModelFinal = [];
    for(let i = 0; i < topicModels.length; i++){
        topicModelFinal.push({
            topic: topicModels[i].topic, 
            problems : problemTopic[i]
        });
    }
    return topicModelFinal;
}

module.exports = {notionJsonArrayParser};