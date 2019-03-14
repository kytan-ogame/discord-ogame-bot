const conf = require('../conf.json');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = class Report {
	constructor(api) {
		this.api = api;
		this.apiToken = conf.ogameApiToken;
		const splittedApi = this.api.split('-');
		const universe = splittedApi[2];
		const community = splittedApi[1];
		this.initTranslations(community);

		this.apiPrefix = `https://s${universe}-${community}.ogame.gameforge.com/api/v1/`;
	}

	initTranslations(community) {
		let translationPath = `translations/${community}.json`;
		// fs.existsSync se base sur le repertoire du projet node, alors que
		// require se base sur le fichier en cours de lecture (Report.js)
		if (!fs.existsSync(translationPath)) {
			translationPath = `translations/en.json`;
		}
		this.translations = require('../' + translationPath);
	}

	t(key) {
		return this.translations[key] || (key + ' TO TRANSLATE');
	}

	fetch(action) {
		// return fetch(this.apiPrefix+action+'&api_key='+this.apiToken)
		return fetch('https://test-jv.oxatis.com/ws/wsGetCategories.asp?accid=125302&catid=3195233&sort=0&sortdir=0&Mode=9&LangID=0')
				.then(res => res.json())
				.then(res => {
					this.responseJson = res;
				})
	}

	generateFields(fields, type) {
		let fieldsToReturn = [];
		const icons = {
			'sr': [
				':moneybag:', ':rocket:', ':shield:', ':office:', ':microscope:'
			]
		};
		let i = 0;
		for (let title in fields) {
			if (fields.hasOwnProperty(title)) {
				const nTotal = fields[title].length;
				let cols = [];
				for (let j = 0; j < nTotal; j++) {
					// init de chaque colonne
					if (j < 3) {
						cols.push({"name": icons[type][i], "value": '', inline: true});
					}
					const curr = fields[title][j];
					const key = Object.keys(curr)[0];
					// affectation de l'itme courant dans la bonne colonne
					cols[j % 3].value += '**' + this.t(key) + '** : \n' + curr[key] + '\n'
				}

				fieldsToReturn.push({
					"name": icons[type][i++],
					"value": '```js\n' + this.t(title) + '```\n',
				});
				fieldsToReturn.push.apply(fieldsToReturn, cols);
			}
		}
		return fieldsToReturn;
	}
}