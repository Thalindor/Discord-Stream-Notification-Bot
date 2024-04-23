const { SlashCommandBuilder } = require('discord.js');
const { getUser } = require('../../twitchApi/getUser');
const { getUserEmotes } = require('../../twitchApi/getUserEmotes');
const { EmbedBuilder } = require('discord.js');
const { streamers } = require('../../twitchApi/registeredStreamers');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('show-subscriptions')
		.setDescription('See your subscriptions.'),
	async execute(interaction) {
        let streamersList = ''
        for(let i = 0; streamers.length > i; i++){
           streamersList = streamersList + '\n' + i + '. ' + streamers[i][4]
        }

        await interaction.reply(`Subscription List: ${streamersList}`);
    
	},
};
