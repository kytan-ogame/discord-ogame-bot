const Discord = require('discord.js');
const CombatReport = require('./class/CombatReport');
const RecyclingReport = require('./class/RecyclingReport');
const SpyReport = require('./class/SpyReport');

var a = new SpyReport();


const bot = new Discord.Client();
const token = 'NTU0NjEzMjY4MjkyMDQyNzY0.D2lEVg.UDb4u_7tVsj4DhQdnl_dk7ZHfFk';
bot.login(token);

const commandPrefix = '!ogame-report';

bot.on('ready', () => {
	bot.user.setActivity('Ogame').catch(console.error);
});

bot.on('message', (msg) => {
	// message d'un bot --> leave
	if (msg.author.bot) return;
	// message ne commencant pas par notre prefixe --> leave
	if (!msg.content.startsWith(commandPrefix)) return;

	let command = msg.content.split(" ").slice(1);
	console.info(command)
});

