const axios = require('axios');
const { streamers } = require('./registeredStreamers')
const { getTwitchToken } = require('./getTwitchToken');


twitchClientSecret = process.env.twitchClientSecret
twitchClientID = process.env.twitchClientID

async function checkStreams() {
   const token = await getTwitchToken();
   if(token == null){
    return "Couldn't reach to token"
   }else{
    try {
        for(let i = 0; streamers.length > i; i++){
            const response = await axios({
                method: "GET",
                url: `https://api.twitch.tv/helix/streams?user_login=${streamers[i][0]}`,
                headers: {
                    "Content-Type": "application/json",
                    'Client-Id': twitchClientID,
                    'Authorization': `Bearer ${token}`
                },
            })
            if(response.data.data[0] && streamers[i][1] == false){
                //console.log(response.data.data[0].user_name);
                //console.log(streamers[i])
                streamers[i][1] = true;
                //console.log(streamers[i][1])
                streamers[i][2] = true;
                streamers[i][3] = response.data.data[0].title;
                //console.log(streamers[i][3])

                
            }else if(!response.data.data[0] && streamers[i][1] == true){
               // console.log(streamers[i][0],streamers[i][1]);
                streamers[i][1] = false;
               // console.log(streamers[i][1])
                streamers[i][3] = '';

            }
           // console.log(i + '. ' + streamers[i][0])
        }
    } catch (error) {
        console.error("Error getting Twitch token:", error)
        return null;
    }
   }
}

module.exports = {checkStreams}