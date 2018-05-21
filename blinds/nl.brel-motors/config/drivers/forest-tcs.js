'use strict';

module.exports = {
	id: 'MLE-25',
	name: {
		en: 'Forest-TCS Remote',
		nl: 'Forest-TCS Afstandsbediening',
	},
	icon: '',
	class: 'windowcoverings',
	capabilities: [
		'windowcoverings_state',
	],
	images: {
//		large: './drivers/MLE-25/assets/images/large.jpg',
//		small: './drivers/MLE-25/assets/images/small.jpg',
		large: './drivers/MLE-25/assets/images/forest-large.png',
		small: './drivers/MLE-25/assets/images/forest-small.png',
	},
	rf: {
		signal: 'brel',
	},
	settings: [],
	pair: [
		{
			id: 'imitate',
			rf_template: 'imitate',
		},
		{
			id: 'test_switch',
			rf_template: 'test_switch',
		},
		{
			id: 'done',
			rf_template: 'done',
		},
	],
};
