const Report = require('./Report');
const dateFormat = require('dateformat');
module.exports = class SpyReport extends Report {
	init() {
		this.rootingActionGF = 'spy/report';
		this.fieldsIcons = {
			'resources': ':moneybag:',
			'ships': ':rocket:',
			'defense': ':shield:',
			'buildings': ':office:',
			'research': ':microscope:',
			'repairOrder': ':wrench:'
		};
	}

	format() {
		const data = this.responseJson.RESULT_DATA;
		return new Promise((resolve, reject) => {
			let fields = {
				'resources|3': [
					{'metal': data.details.resources.metal},
					{'crystal': data.details.resources.crystal},
					{'deuterium': data.details.resources.deuterium},
				]
			};

			if (!data.generic.failed_ships) {
				fields.ships = data.details.ships;
				fields.repairOrder = data.details.repairOrder;
			}
			if (!data.generic.failed_defense) {
				fields.defense = data.details.defense;
			}
			if (!data.generic.failed_buildings) {
				fields.buildings = data.details.buildings;
			}
			if (!data.generic.failed_research) {
				fields.research = data.details.research;
			}
			const generatedFields = this.generateFields(fields);

			/*
				GESTION DE L'ACTIVITE
			 */
			let activityMsg = this.t('activity') + ': ';
			switch (true) {
				case data.generic.activity === 15 :
					activityMsg = ' :exclamation:' + activityMsg + data.generic.activity + this.t('minutes');
					break;
				case data.generic.activity > 15 :
					activityMsg = ' :grey_exclamation:' + activityMsg + data.generic.activity + this.t('minutes');
					break;
				default:
					activityMsg += ' ' + this.t('noActivity')
			}
			/*
				GESTION DE LA DATE DU RAPPORT
			 */
			const date = new Date(data.generic.event_time);


			const embed = {
				"title": `${this.planetTypeIcons[data.generic.defender_planet_type]} - ${data.generic.defender_planet_name} [${data.generic.defender_planet_coordinates}] (${this.t('player')}: ${data.generic.defender_name})`,
				"description": `${this.t('spiedBy')} ${data.generic.attacker_name} - ${dateFormat(date, this.t('localDateFormat'))}\n
				${activityMsg} \n
				[${this.t('openWith')} **TrashSim**](https://trashsim.universeview.be/${this.community}?SR_KEY=${this.api}) \n
				[${this.t('openWith')} **SpeedSim**](http://topraider.eu/index.php?SR_KEY=${this.api})`,
				"fields": generatedFields,
				"footer": {
					"text": this.api
				},
			};
			resolve(embed);

		})
	}
}