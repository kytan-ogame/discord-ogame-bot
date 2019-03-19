const Report = require('./Report');
module.exports = class MissileReport extends Report {
	init(){
		this.fieldsIcons = {
			'defence': ':rocket:',
		}
	}
	getInfos() {
		return this.fetch('missile/report?mr_id='+this.api)
	}
	format() {
		return new Promise((resolve, reject) => {
			const fields = {
				"defence": [
					{"401": "__1.000__ **(-523)**"},
					{"402": "__4.699__ **(-33)**"},
					{"403": "__3000__ **(-30)**"},
					{"44": "__3000__ **(-30)**"},
					{"405": "__3000__ **(-30)**"},
				],

			}
			const embed = {
				"timestamp": "2019-03-04T13:34:56.950Z",
				"footer": {
					"text": "Missilé par KYTAN"
				},
				"title": "Rapport de missilage de Colonie [3:478:15] (Joueur: Viceregent Deimos)",
				"fields": this.generateFields(fields)
			};
			resolve(embed);

		})
	}
}