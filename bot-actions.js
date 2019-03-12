module.exports = {
	convertRE: ({msg, keys}) => {
		var nKeys = keys.length;
		for(let i = 0; i < nKeys; i++){
			msg.channel.send('convertRE --> '+ keys[i]);
		}
	}
	, convertRC: ({msg, keys}) => {
		var nKeys = keys.length;
		for(let i = 0; i < nKeys; i++){
			msg.channel.send('convertRC --> '+ keys[i]);
		}
	}
	, help: ({msg}) => {
		msg.channel.send('sendHelp');
	}
};

