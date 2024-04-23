const axios = require('axios')
const { getTwitchToken } = require('./getTwitchToken');


twitchClientSecret = process.env.twitchClientSecret
twitchClientID = process.env.twitchClientID


async function getUser(username) {
   const token = await getTwitchToken();

   if(token == null){
    return "Couldn't reach to token"
   }else{
    try {
        const response = await axios({
            method: "GET",
            url: `https://api.twitch.tv/helix/users?login=${username}`,
            headers: {
                "Content-Type": "application/json",
                'Client-Id': twitchClientID,
                'Authorization': `Bearer ${token}`
            },
        })
            if(!response.data.data[0]){
                var user = new Object();
                user["id"] = "";
                return user;
            }else{
                var user = new Object();
                user["id"] = response.data.data[0].id;
                user["display_name"] = response.data.data[0].display_name;
                user["image"] = response.data.data[0].profile_image_url;
                user["url"] = `https://www.twitch.tv/${response.data.data[0].login}`;
                return user;
            }

    } catch (error) {
        console.error("Error getting Twitch token:", error)
        return null;
    }
   }

}

module.exports = {getUser}
