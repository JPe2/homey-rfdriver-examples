'use strict';

// This is the signal definition extracted from our remote

module.exports = {
	sof: [6270], // Start of frame
	eof: [7290], // End of frame
	words: [
		[1455, 740], // 0
		[740, 1455], // 1
	],
	interval: 10000, // Time between two subsequent signals. You can get this by trial and error. (most of the time the rule is: if it works it works)
	sensitivity: 0.5, // between 0.0 and 2.0. This value indicates how far off the timings of the words can be and still be parsed (e.g. `1000, 300` is still parsable to word `1100, 390`)
	repetitions: 10, // choose something that you like, more repetitions means sending takes longer but is more likely to arrive to the receiver
	minimalLength: 24, // (35 - sof.length) / word[x].length
	maximalLength: 24, // all signals should be of this length
	
};
