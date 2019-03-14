const Discord = require('discord.js');
const CombatReport = require('./class/CombatReport');
const RecyclingReport = require('./class/RecyclingReport');
const SpyReport = require('./class/SpyReport');
const MissileReport = require('./class/MissileReport');
const conf = require('./conf.json');


const bot = new Discord.Client();
// connection du bot sur le bon token discord
bot.login(conf.discordBotToken);

// bot connecté au chan utilisateur
bot.on('ready', () => {
	bot.user.setActivity('Ogame').catch(console.error);
});

// lorsqu'un utilisateur du discord poste un message
bot.on('message', (msg) => {
	// message d'un bot --> leave
	if (msg.author.bot) return;

	// detection rapports divers dans le message de l'utilisateur
	const regReportApi = /(cr|sr|rr|mr)-[a-z]{1,3}-[\d]{1,3}-[a-z0-9]*/gm;

	let match;
	while ((match = regReportApi.exec(msg.content)) !== null) {
		if (match.index === regReportApi.lastIndex) {
			regReportApi.lastIndex++;
		}
		repplyReport(msg, match[0], match[1]);
	}
});

function repplyReport(msg, api, type) {
	//msg.channel.send('on va convertir l\'api: ' + api + ' ----- ' + type);
	const mapping = {
		'cr': CombatReport,
		'sr': SpyReport,
		'rr': RecyclingReport,
		'mr': MissileReport,
	};
	if (api && type && mapping[type]) {
		const report = new mapping[type](api);
		report.getInfos()
				.then(() => report.format())
				.then(embed => msg.channel.send({embed}))
	}
}

