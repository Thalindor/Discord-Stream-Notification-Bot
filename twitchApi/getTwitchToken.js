const axios = require('axios')

twitchClientSecret = process.env.twitchClientSecret
twitchClientID = process.env.twitchClientID

async function getTwitchToken(){
    try {
        const response = await axios.post('https://id.twitch.tv/oauth2/token', {
            client_id: twitchClientID,
            client_secret: twitchClientSecret,
            grant_type: 'client_credentials'
        })
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting Twitch token:", error)
        return null;
    }
}

module.exports = {getTwitchToken}