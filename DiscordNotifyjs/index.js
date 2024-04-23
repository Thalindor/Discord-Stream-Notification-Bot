const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { checkStreams } = require('./twitchApi/checkStreams');
const { streamers } = require('./twitchApi/registeredStreamers')
const { EmbedBuilder } = require('discord.js');
const { getUser } = require('./twitchApi/getUser');
const { getUserEmotes } = require('./twitchApi/getUserEmotes');

require('dotenv').config()
const  token  = process.env.token
twitchClientSecret = process.env.twitchClientSecret
twitchClientID = process.env.twitchClientID
channelID = process.env.channelID


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
	
	setInterval( async function() {
		checkStreams()
		
		
		const channelId = channelID;
        const channel = client.channels.cache.get(channelId);
		
		
		for(let i = 0; streamers.length > i; i++){
			if(streamers[i][1] == true && streamers[i][2] == true ){
				const user = await getUser(streamers[i][0]);
				const userEmote = await getUserEmotes(user.id);

				const userEmbed = new EmbedBuilder()
				.setTitle(`${user.display_name} is live!`)
                .setImage(user.image)
                .setURL(user.url)
                .setDescription(streamers[i][3])
				.addFields(
					{ name: 'Twitch Link:', value: user.url },

				)


				channel.send({embeds: [userEmbed]});
                streamers[i][2] = false;

			}
		}
	}, 10000);
}); 



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

});

client.login(token);