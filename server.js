const Discord = require('discord.js');
const CombatReport = require('./class/CombatReport');
const RecyclingReport = require('./class/RecyclingReport');
const SpyReport = require('./class/SpyReport');
const MissileReport = require('./class/MissileReport');
const conf = require('./conf.json');

const bot = new Discord.Client();

// bot connection to discord channel
bot.login(conf.discordBotToken);
bot.on('ready', () => {
	bot.user.setActivity('Ogame').catch(console.error);
});

// when a user send a message on the channel
bot.on('message', (msg) => {

	// we don't care about bot messages
	if (msg.author.bot) return;

	// report detection
	// only prefixed by space or string start flag
	//  --> prevent getting report API from url get param for exemple (combat beautifier)
	const regReportApi = /(^|[ ])(cr|sr|rr|mr)-[a-z]{1,3}-[\d]{1,3}-[a-z0-9]*/gm;

	let match;
	while ((match = regReportApi.exec(msg.content)) !== null) {
		if (match.index === regReportApi.lastIndex) {
			regReportApi.lastIndex++;
		}

		// match[0] --> full string API
		// match[1] --> space before api
		// match[2] --> report type (cr,rr,mr,sr)
		repplyReport(msg, match[0].trim(), match[2]);
	}
});

// create the report needed
// repply with the report formated
function repplyReport(msg, api, type) {
	const mapping = {
		'cr': CombatReport,
		'sr': SpyReport,
		'rr': RecyclingReport,
		'mr': MissileReport,
	};
	if (api && type && mapping[type]) {
		const report = new mapping[type](api);
		report.fetch()
				.then(() => report.handleError())
				.then(() => report.format())
				// send the formatted report to everyone
				.then(embed => msg.channel.send({embed}))
				// send the error with mention to user
				// that asked for formatting
				//.catch(err => msg.reply(err))
				.catch(console.log)
	}
}

