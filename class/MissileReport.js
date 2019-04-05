const Report = require('./Report');
const dateFormat = require('dateformat');
module.exports = class MissileReport extends Report {
	init() {
		this.rootingActionGF = 'missile/report';
		this.fieldsIcons = {
			'defense': ':rocket:',
		}
	}

	getInfos() {
		return this.fetch('missile/report?mr_id=' + this.api)
	}

	format() {
		return new Promise((resolve, reject) => {
			const data = this.responseJson.RESULT_DATA;
			const date = new Date(data.generic.event_time);

			const fields = {
				"defense": []
			};
			const nDefense = data.details.defense.length;
			const nDefenseDestroyed = data.details.defense_destroyed.length;

			for(let i = 0; i < nDefense; i++){
				const currentDefense = data.details.defense[i];
				let destroyed = 0;
				for(let j = 0; j < nDefenseDestroyed; j++){
					const currentDefenseDestroyed = data.details.defense_destroyed[i];
					if(currentDefenseDestroyed.defense_type === currentDefense.defense_type){
						destroyed = currentDefenseDestroyed.count;
					}
				}
				const def = {};
				def[`${currentDefense.defense_type}`] = `${currentDefense.count} **(-${destroyed})**`;
				fields.defense.push(def);
			}

			const embed = {
				"title": "Rapport de missilage de Colonie [3:478:15] (Joueur: Viceregent Deimos)",
				"description": `${this.t('recycledBy')} ${data.generic.attacker_name} (${this.t('503')}: ${data.generic.missiles_lost_attacker}) - ${dateFormat(date, this.t('localDateFormat'))}`,
				"fields": this.generateFields(fields),
				"footer": {
					"text": this.api
				},
			};
			resolve(embed);

		})
	}
};