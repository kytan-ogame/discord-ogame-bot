const Report = require('./Report');
const dateFormat = require('dateformat');
module.exports = class RecyclingReport extends Report {
	init() {
		this.rootingActionGF = 'recycle/report';
	}

	format() {
		return new Promise((resolve, reject) => {
			const data = this.responseJson.RESULT_DATA;
			const date = new Date(data.generic.event_time);
			const fields = {};
			fields['resourcesInDebrisField'] = [
				{'metal': data.generic.metal_in_debris_field},
				{'crystal': data.generic.crystal_in_debris_field}
			];
			const totalRetrieved = (parseInt(data.generic.metal_retrieved) + parseInt(data.generic.crystal_retrieved)) || 0;
			const totalInField = (parseInt(data.generic.metal_in_debris_field) + parseInt(data.generic.crystal_in_debris_field)) || 0;
			let percentageRetrieved = ((totalRetrieved / totalInField * 100) || 100).toFixed(2);
			fields[this.t('resourcesRetrieved') + ' (' + percentageRetrieved + '%)'] = [
				{'metal': data.generic.metal_retrieved},
				{'crystal': data.generic.crystal_retrieved}
			];

			const embed = {
				"title": `${this.t('recyclingReport')} [${data.generic.coordinates}]`,
				"description": `${this.t('recycledBy')} ${data.generic.owner_name} (${this.t('209')}: ${data.generic.recycler_count}) - ${dateFormat(date, this.t('localDateFormat'))}`,
				"fields": this.generateFields(fields),
				"footer": {
					"text": this.api
				},
			};
			resolve(embed);

		})
	}
};