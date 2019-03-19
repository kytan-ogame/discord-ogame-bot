const Report = require('./Report');
const dateFormat = require('dateformat');
module.exports = class SpyReport extends Report {
	init() {
		this.fieldsIcons = {
			'ressources': ':moneybag:',
			'fleets': ':rocket:',
			'defence': ':shield:',
			'building': ':office:',
			'research': ':microscope:',
			'fleetsRepair': ':wrench:'
		};
		this.planetTypeIcons = [
				'',
				':earth_africa:', // id 1
				'',
				':full_moon:' // id 3
		];
	}

	getInfos() {
		return this.fetch('spy/report?sr_id=' + this.api)
	}

	format() {
		return new Promise((resolve, reject) => {
			let generatedFields = this.generateFields({
				'ressources|3': [
					{'metal': '1.000.000'},
					{'crystal': '2.000.000'},
					{'deuterium': '3.000.000'},
				],
				'fleets': [
					{'202': '55.663'},
					{'203': '55.663'},
					{'204': '55.663'},
					{'205': '55.663'},
					{'206': '55.663'},
					{'207': '1.200'},
					{'208': '1.200'},
					{'213': '5.001'},
					{'214': '3.500.001'},
				],
				'fleetsRepair': [
					{'204': '55.663'},
					{'205': '55.663'},
					{'206': '55.663'},
				],
				'defence': [],
				'building': [
					{'1': 15},
					{'2': 15},
					{'3': 1},
					{'4': 5},
				],
				'research': [
					{'106': 15},
					{'108': 15},
					{'109': 15},
					{'110': 15},
					{'111': 15},
					{'113': 15},
					{'114': 15},
					{'115': 15},
					{'117': 15},
					{'118': 15},
					{'120': 15},
					{'121': 15},
					{'122': 15},
					{'123': 15},
					{'124': 15},
					{'199': 15},
				]
			});

			/*
				GESTION DE L'ACTIVITE
			 */
			const activity = 15;
			const planetType = 3;
			let activityMsg = this.t('activity') + ': ';
			switch (true) {
				case activity < 16 :
					activityMsg = ' :exclamation:' + activityMsg + activity + this.t('minutes');
					break;
				case activity < 60 :
					activityMsg = ' :grey_exclamation:' + activityMsg + activity + this.t('minutes');
					break;
				default:
					activityMsg += ' ' + this.t('noActivity')
			}
			/*
				GESTION DE LA DATE DU RAPPORT
			 */
			const timestamp = '2015-06-23T16:35:14+02:00';
			const date = new Date(timestamp);


			const embed = {
				"footer": {
					"text":  `${this.t('spiedBy')} KYTAN - ${dateFormat(date, this.t('localDateFormat'))}`
				},
				"title": `${this.planetTypeIcons[planetType]} - Colonie [3:478:15] (Joueur: Viceregent Deimos)`,
				"description": `${activityMsg} \n
				[${this.t('openWith')} **TrashSim**](https://trashsim.universeview.be/${this.community}?SR_KEY=${this.api}) \n
				[${this.t('openWith')} **SpeedSim**](http://topraider.eu/index.php?SR_KEY=${this.api})`,
				"fields": generatedFields
			};
			resolve(embed);

		})
	}
}