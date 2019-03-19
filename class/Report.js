const conf = require('../conf.json');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const fs = require('fs');

module.exports = class Report {
	constructor(api) {
		this.api = api;
		this.apiToken = conf.ogameApiToken;
		this.fieldsIcons = {};
		const splittedApi = this.api.split('-');
		this.universe = splittedApi[2];
		this.community = splittedApi[1];
		this.initTranslations();

		this.apiPrefix = `https://s${this.universe}-${this.community}.ogame.gameforge.com/api/v1/`;
		this.init && this.init();
	}

	initTranslations() {
		this.lang = this.community;
		// fs.existsSync se base sur le repertoire du projet node, alors que
		// require se base sur le fichier en cours de lecture (Report.js)
		if (!fs.existsSync(`translations/${this.lang}.json`)) {
			this.lang = 'en';
		}
		this.translations = require(`../translations/${this.lang}.json`);
	}

	t(key) {
		return this.translations[key] || key;
	}

	fetch(action) {
		// return fetch(this.apiPrefix+action+'&api_key='+this.apiToken)
		return fetch('https://test-jv.oxatis.com/ws/wsGetCategories.asp?accid=125302&catid=3195233&sort=0&sortdir=0&Mode=9&LangID=0')
				.then(res => res.json())
				.then(res => {
					this.responseJson = res;
				})
	}

	generateFields(fields, nColsGlobal = 2) {
		let fieldsToReturn = [];
		for (let groupTitle in fields) {
			if (fields.hasOwnProperty(groupTitle)) {
				const title = groupTitle.split('|')[0];

				const nCols =  groupTitle.split('|')[1] || nColsGlobal;
				const icon = this.fieldsIcons[title] || '';
				const nTotal = fields[groupTitle].length;
				let cols = [];
				for (let i = 0; i < nTotal; i++) {
					const curr = fields[groupTitle][i];
					const key = Object.keys(curr)[0];
					// init de chaque colonne
					if (i< nCols) {
						cols.push({"name": '.', "value": '**' + this.t(key) + '** :' + curr[key] + '\n', inline: true});
					} else {
						// affectation de l'itme courant dans la bonne colonne
						cols[i % nCols].value += '**' + this.t(key) + '** :' + curr[key] + '\n'
					}
				}

				fieldsToReturn.push({
					"name": '────',
					"value": icon + ' __**' + this.t(title) + '**__ ' + (nTotal === 0 ? this.t('nothing') : ''),
				});
				fieldsToReturn.push.apply(fieldsToReturn, cols);
			}
		}
		return fieldsToReturn;
	}
}