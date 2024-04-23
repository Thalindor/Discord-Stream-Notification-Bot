const { SlashCommandBuilder } = require('discord.js');
const { getUser } = require('../../twitchApi/getUser');
const { getUserEmotes } = require('../../twitchApi/getUserEmotes');
const { EmbedBuilder } = require('discord.js');
const { streamers } = require('../../twitchApi/registeredStreamers');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-notification')
		.setDescription('Turn off notification from user.')
        .addStringOption(option =>
            option.setName('input')
            .setDescription("Enter the streamers nickname")
            .setRequired(true)
            ),
	async execute(interaction) {
        const username = interaction.options.getString('input').toLowerCase();
        const user = await getUser(username);

        let sameUser = false
            for(let i = 0; streamers.length > i; i++){
                if(streamers[i][0] == username){
                    sameUser = true;
                    streamers.splice(i, 1)
                }
            }

            if(sameUser){
                await interaction.reply(`You will not recieve noficiation from ${username}.`);
            }else{
                await interaction.reply(`Error: ${username} not found.`);

            }
	},
};
