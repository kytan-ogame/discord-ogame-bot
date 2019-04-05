const Report = require('./Report');
const dateFormat = require('dateformat');
const Utils = require('./Utils');
module.exports = class CombatReport extends Report {
	init() {
		this.rootingActionGF = 'combat/report';
	}

	format() {
		const data = this.responseJson.RESULT_DATA;

		return new Promise((resolve, reject) => {
					const date = new Date(data.generic.event_time);

					// formatting data for attackers
					const attackers = this.getSideInfos(data.attackers, data.rounds || [], 'attacker_ship_losses');
					// formatting data for defenders
					const defenders = this.getSideInfos(data.defenders, data.rounds || [], 'defender_ship_losses');
					// creating title of last part
					const endText = this.getEndText(data);

					// configuration object for discord embed
					let fields = {};
					fields[this.getFormattedTitle(this.t('beforeFight'))] = {};
					fields['attackers|3'] = attackers.before;
					fields['defenders|3'] = defenders.before;
					// after fight - x rouond(s)
					fields[this.getFormattedTitle(this.t('afterFight') + ' - ' + (data.rounds.length || 1) + ' ' + this.t('rounds'))] = {};
					fields['attackers|03'] = attackers.after;
					fields['defenders|03'] = defenders.after;
					fields[this.getFormattedTitle(this.t(endText))] = {};
					if (data.generic.moon_created) {
						fields[`${this.planetTypeIcons[3]} ${this.t('moonCreated')} (${data.generic.moon_size} km)`] = {};
					}
					if (data.generic.winner === 'attacker') {
						fields['looting|3'] = [
							{'metal': data.generic.loot_metal},
							{'crystal': data.generic.loot_crystal},
							{'deuterium': data.generic.loot_deuterium},
						];
					}
					fields['resourcesInDebrisField'] = [
						{'metal': data.generic.debris_metal},
						{'crystal': data.generic.debris_crystal}
					];
					fields['lostUnits'] = [
						{'attackers': data.generic.units_lost_attackers},
						{'defenders': data.generic.units_lost_defenders}
					];
					let generatedFields = this.generateFields(fields);
					const embed = {
						"title": `${this.planetTypeIcons[data.generic.combat_planet_type]} [${data.generic.combat_coordinates}] - ${dateFormat(date, this.t('localDateFormat'))}`,
						"description": `${[...attackers.playersName].join(' + ')} :vs: ${[...defenders.playersName].join(' + ')}\n
				[${this.t('openWith')} **OGotcha**](https://ogotcha.universeview.be/${this.community}?CR_KEY=${this.api}) \n
				[${this.t('openWith')} **TopRaider**](http://topraider.eu/index.php?CR_KEY=${this.api})`,
						"fields": generatedFields,
						"footer": {
							"text": this.api
						},

					};
					resolve(embed);

				}
		)
	}

	getEndText(data) {
		if (data.generic.winner === 'attacker') {
			return 'attackersWin';
		}
		if (data.generic.winner === 'defender') {
			return 'defendersWin';
		}
		return 'draw';
	}

	getFormattedTitle(title) {
		return `\`\`\`fix\n${title}\`\`\``;
	}

	getSideInfos(slots, rounds, roundsInfoName) {
		const sideInfos = {
			playersName: new Set(),
			before: [],
			after: [],
		};
		const playerTechs = []; // players combat technologies

		/***************
		 BEFORE FIGHT
		 ***************/
		const playersInfosBefore = {};
		const slotNumber = slots.length;
		for (let i = 0; i < slotNumber; i++) {
			const currentSlot = slots[i];
			const playerName = currentSlot.fleet_owner + '[' + (currentSlot.fleet_owner_alliance_tag || '') + ']';

			// check player has already been subscribed
			if (!sideInfos.playersName.has(playerName)) {
				sideInfos.playersName.add(playerName);
				playerTechs.push(currentSlot.fleet_weapon_percentage + '% / ' + currentSlot.fleet_shield_percentage + '% / ' + currentSlot.fleet_armor_percentage + '%')
			}
			playersInfosBefore[playerName] = playersInfosBefore[playerName] || {};

			// mise à jour du nombr de vaisseaux par type
			const nShipType = currentSlot.fleet_composition.length;
			for (let j = 0; j < nShipType; j++) {
				playersInfosBefore[playerName][currentSlot.fleet_composition[j].ship_type] = playersInfosBefore[playerName][currentSlot.fleet_composition[j].ship_type] || 0;
				playersInfosBefore[playerName][currentSlot.fleet_composition[j].ship_type] += currentSlot.fleet_composition[j].count;
			}
		}
		let i = 0;
		for (let name in playersInfosBefore) {
			if (playersInfosBefore.hasOwnProperty(name)) {
				let value = '\n*' + playerTechs[i] + '*';
				for (let ship in playersInfosBefore[name]) {
					if (playersInfosBefore[name].hasOwnProperty(ship)) {
						value += `\n${this.t(ship)}: ${Utils.parseNumber(playersInfosBefore[name][ship])}`
					}
				}
				sideInfos.before.push({name: '__' + name + '__', value});
				i++;
			}
		}

		/***************
		 AFTER FIGHT
		 ***************/
		const playersName = [...sideInfos.playersName];
		const playersInfosAfter = JSON.parse(JSON.stringify(playersInfosBefore));
		const roundsNumber = rounds.length;
		for (let i = 0; i < roundsNumber; i++) {
			const slotLosses = rounds[i][roundsInfoName].length;
			for (let j = 0; j < slotLosses; j++) {
				const playerName = playersName[rounds[i][roundsInfoName][j].owner];
				playersInfosAfter[playerName][rounds[i][roundsInfoName][j].ship_type] -= rounds[i][roundsInfoName][j].count;
			}
		}

		for (let name in playersInfosAfter) {
			if (playersInfosAfter.hasOwnProperty(name)) {
				let value = '';
				for (let ship in playersInfosAfter[name]) {
					if (playersInfosAfter[name].hasOwnProperty(ship)) {
						if (playersInfosAfter[name][ship] !== playersInfosBefore[name][ship]) {
							value += `\n${this.t(ship)}: ${Utils.parseNumber(playersInfosAfter[name][ship])} (-${Utils.parseNumber(playersInfosBefore[name][ship] - playersInfosAfter[name][ship])})`
						} else {
							value += `\n${this.t(ship)}: ${Utils.parseNumber(playersInfosAfter[name][ship])}`
						}
					}
				}
				sideInfos.after.push({name: '__' + name + '__', value});
			}
		}


		// playersInfosBefore.reduce((before, player) => {
		// 	before.push({
		// 		name: `${player} (${currentSlot.fleet_weapon_percentage}/${currentSlot.fleet_shield_percentage}/${currentSlot.fleet_armor_percentage})\t`,
		// 	})
		// }, sideInfos.before)
		// sideInfos.before.push({
		// 	name: `${playerName} (${currentSlot.fleet_weapon_percentage}/${currentSlot.fleet_shield_percentage}/${currentSlot.fleet_armor_percentage})\t`,
		// 	value: `
		// 		${this.t('202')}: ${Utils.parseNumber(9000000)}\t
		// 		${this.t('203')}: ${Utils.parseNumber(9000000)}\t
		// 		${this.t('204')}: ${Utils.parseNumber(9000000)}\t
		// 		`
		// });
		return sideInfos;
	}
}
;