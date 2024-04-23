const axios = require('axios')
const { getUser } = require('./getUser');
const { getTwitchToken } = require('./getTwitchToken');


twitchClientSecret = process.env.twitchClientSecret
twitchClientID = process.env.twitchClientID

async function getUserEmotes(broadcasterID) {
    const token = await getTwitchToken();
    try {
        if(broadcasterID == null){
            return null;
        }else{

            const response = await axios({
                method: "GET",
                url: `https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${broadcasterID}`,
                headers: {
                    "Content-Type": "application/json",
                    'Client-Id': twitchClientID,
                    'Authorization': `Bearer ${token}`
                }
            })
            if(!response.data.data[0].images['url_4x']){
                return console.log('No emote found.')
            }else{
                return response.data.data[Math.floor(Math.random() * Object.keys(response.data.data).length)].images['url_4x'];
            }
        }
    } catch (error) {
        //console.log("Error getting users emote:", error);
        return null;
    }
}

module.exports = {getUserEmotes}