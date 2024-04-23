const { SlashCommandBuilder } = require('discord.js');
const { getTwitchToken } = require('../../twitchApi/getTwitchToken');
const { getUser } = require('../../twitchApi/getUser');
const { getUserEmotes } = require('../../twitchApi/getUserEmotes');
const { checkStreams } = require('../../twitchApi/checkStreams');
const { EmbedBuilder } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { streamers } = require('../../twitchApi/registeredStreamers');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-notification')
		.setDescription('Get notified when the Twitch user you enter goes live')
        .addStringOption(option => 
            option.setName('input')
            .setDescription("Enter the streamers nickname")
            .setRequired(true)
            ),
	async execute(interaction) {
        const username = interaction.options.getString('input').toLowerCase();
        const user = await getUser(username);
        //checkStreams();
        
        /* 
         {   user object example 
             id: '1234',
             display_name: 'xyzd',
            image: 'example.png',
            url: example/username
         }
        */
        if(user == null){
            await interaction.reply("Check username, streamer not found!");
        }else if(user.id == ''){
            await interaction.reply("Check username, streamer not found!");
        }
        else{
            let sameUser = false
            for(let i = 0; streamers.length > i; i++){
                if(streamers[i][0] == username){
                    sameUser = true;
                }
            }
            
            if(!sameUser){
                streamers.push([username, false,false,'', user.display_name])
            }
            const userEmote = await getUserEmotes(user.id);
            if(!sameUser){
                const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(user.url)
                .setImage(user.image)
                .setDescription(`Subscription Successful. You will receive a notification when ${user.display_name} goes live.`)
                .setThumbnail(userEmote)
                .setURL(user.url)
                await interaction.reply({
                    embeds: [exampleEmbed]
                })
            }else{
                const exampleEmbed = new EmbedBuilder()
                .setThumbnail(user.image)
                .setDescription(`This user is already registered. You will receive a notification when ${user.display_name} goes live.`)
                await interaction.reply({
                    embeds: [exampleEmbed]
                })
            }
        }
	},
};