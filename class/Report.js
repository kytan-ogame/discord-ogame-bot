const conf = require('../conf.json');
const fetch = require('node-fetch');
const fs = require('fs');
const Utils = require('./Utils');

class Report {
	constructor(api) {
		this.api = api;

		// dev api token to access GF api
		this.apiToken = conf.ogameApiToken;

		// mapping title field and icons
		this.fieldsIcons = {};

		// store api data to create fetch URL and some other stuff
		const splittedApi = this.api.split('-');
		this.reportType = splittedApi[0];
		this.community = splittedApi[1];
		this.universe = splittedApi[2];
		this.apiId = splittedApi[3];

		this.initTranslations();

		// general mapping icon for planet type
		this.planetTypeIcons = [
			'',
			':earth_africa:', // id 1
			'',
			':full_moon:' // id 3
		];

		this.init && this.init();
	}

	// try to initialize translation for the current community
	// if not possible -> initialize to English
	initTranslations() {
		this.lang = this.community;
		// check translation for current community exists
		// if not --> set locale to EN
		if (!fs.existsSync(`translations/${this.lang}.json`)) {
			this.lang = 'en';
		}
		// get translation JSON object
		this.translations = require(`../translations/${this.lang}.json`);
	}

	// get translation from $key
	// return $key if undefined in translation JSON object
	t(key) {
		return this.translations[key] || key;
	}

	// retrieve report information from GF server (or cache if available)
	fetch() {
		// report is already in cache --> serve it
		if (fs.existsSync(`saved_reports/${this.api}.json`)) {
			return new Promise((resolve) => {
				this.responseJson = require(`../saved_reports/${this.api}.json`);
				resolve();
			})
		}
		// need to retrieve the report form GF servers
		return fetch(this.getFetchUrl())
				.then(res => res.json())
				.then(json => {
					return new Promise((resolve, reject) => {
						this.responseJson = json;
						fs.writeFile('saved_reports/' + this.api + '.json', JSON.stringify(json), (err) => {
							if (err) throw err;
							resolve();
						})
					})
				})
	}

	handleError() {
		// OK = 1000;
		// INVALID_VERSION = 4000;
		// INVALID_API_KEY = 4001;
		// INVALID_API_KEY_EXPIRED = 4002;
		// INVALID_API_PERMISSION = 4003;
		// INVALID_PATH = 4004;
		// INTERNAL_ERROR = 5000;
		// INVALID_CR_ID = 6000;
		// INVALID_SR_ID = 6001;
		// INVALID_RR_ID = 6002;
		// INVALID_MR_ID = 6003;

		return new Promise((resolve, reject) => {
			if (!this.responseJson || !this.responseJson.RESULT_CODE) {
				reject(this.t('errorUnknown'));
			}

			switch (this.responseJson.RESULT_CODE) {
				case 1000:
					resolve();
					break;
				case 4000:
				case 4001:
				case 4002:
				case 4003:
				case 4004:
					reject(this.t('error4')+ ' (#'+this.responseJson.RESULT_CODE+')');
					break
				case 5000:
					reject(this.t('error5')+ ' (#'+this.responseJson.RESULT_CODE+')');
					break
				case 6000:
				case 6001:
				case 6002:
				case 6003:
					reject(this.t('error6')+ ' (#'+this.responseJson.RESULT_CODE+')');
					break;
				default:
					reject(this.t('errorUnknown')+ ' (#'+this.responseJson.RESULT_CODE+')');
			}
		})
	}

	getFetchUrl() {
		//https://s140-de.ogame.gameforge.com/api/v1/spy/report/sr-id=sr-de-140-c36ae8fa56abec206c2b2f178f8a30e0572af0ec&api_key=api ogame token
		return `https://s${this.universe}-${this.community}.ogame.gameforge.com/api/v1/${this.rootingActionGF}?${this.reportType}_id=${this.apiId}&api_key=${this.apiToken}`
	}

	generateFields(fields, nColsGlobal = 2) {
		let fieldsToReturn = [];
		for (let groupTitle in fields) {
			if (fields.hasOwnProperty(groupTitle)) {
				const title = groupTitle.split('|')[0];

				const nCols = groupTitle.split('|')[1] || nColsGlobal;
				const icon = this.fieldsIcons[title] || '';
				const nTotal = fields[groupTitle].length;
				let cols = [];
				for (let i = 0; i < nTotal; i++) {
					const curr = fields[groupTitle][i];
					const field = this.getFieldInfos(curr);
					// init de chaque colonne
					if (i < nCols) {
						cols.push({"name": '\t󠇰\t󠇰', "value": '' + this.t(field.name) + ': ' + field.value + '\n', inline: true});
					} else {
						// affectation de l'itme courant dans la bonne colonne
						cols[i % nCols].value += '\n' + this.t(field.name) + ': ' + field.value + '\n'
					}
				}

				fieldsToReturn.push({
					"name": '\t󠇰\t󠇰',
					"value": icon + ' **' + this.t(title) + '** ' + (nTotal === 0 ? ' → ' + this.t('nothing') : ''),
				});
				fieldsToReturn.push.apply(fieldsToReturn, cols);
			}
		}
		return fieldsToReturn;
	}

	getFieldInfos(field) {
		const keys = Object.keys(field);
		if (keys.length === 1) {
			return {name: this.t(keys[0]), value: Utils.parseNumber(field[keys[0]])};
		} else {
			return {name: this.t(field[keys[0]]), value: Utils.parseNumber(field[keys[1]])};
		}
	}
}

module.exports = Report;