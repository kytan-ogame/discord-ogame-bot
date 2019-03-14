const Report = require('./Report');
module.exports = class SpyReport extends Report {
	getInfos() {
		return this.fetch('spy/report?sr_id=' + this.api)
	}

	format() {
		return new Promise((resolve, reject) => {
			const fields = {
				'ressources': [
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

			}
			const embed = {
				"timestamp": "2019-03-04T13:34:56.950Z",
				"footer": {
					"text": "Sondé par KYTAN"
				},
				"title": "Rapport d`espionnage de Colonie [3:478:15] (Joueur: Viceregent Deimos)",
				"description": "activité: 24min",
				"fields": this.generateFields(fields, 'sr')
			};
			console.info(embed)
			resolve(embed);

		})
	}
}