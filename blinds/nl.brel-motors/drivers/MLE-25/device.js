'use strict';

const Homey = require('homey');
const util = require('homey-rfdriver').util;

// Helper function to turn a number into a bitString of 3 long
const numberToCmdString = cmd => cmd.toString(2).padStart(3, '0');
// The commands mapped to the corresponding bitString
// Cmd id's are replaced with placeholders
const commandMap = new Map([
	['down', numberToCmdString(0x1)],                       // 001 down replaces previous "down"
	['idle', numberToCmdString(0x2)],			// 010 idle  replaces previous "idle"
	['up',   numberToCmdString(0x3)],			// 011 up  replaces previous "up"
]);
// The bitStrings mapped to the corresponding command
const stateMap = new Map(Array.from(commandMap.entries()).map(entry => {
	return entry.reverse();
}));

module.exports = RFDriver => class BrelDevice extends RFDriver {
	
	// This function turns a payload array e.g. [0,0,1,0,1,0,1,0,1,0,1,1,1,1,1,0,0,0,0,0,1,0,0,1] into a data object
	static payloadToData(payload) {
		// Check if the bitString of bit 21-24 exists in the stateMap
//		console.log("ReceivedPayload: " + payload); 
		if (stateMap.has(util.bitArrayToString(payload.slice(21, 24)))) {		
			// Create the data object
			const data = {
				address: util.bitArrayToString(payload.slice(0, 18)),				
				channel: util.bitArrayToString(payload.slice(18, 21)),			
				group: payload.slice(18, 21).indexOf(1) === -1,						
				cmd: stateMap.get(util.bitArrayToString(payload.slice(21, 24))),
			}
//			console.log("Data.Channel: " data.channel + " " + data.cmd );
			
//			if (payload.slice(18, 24) == 100010 ) {              // AB1-ch4-stop
//				data.address = util.bitArrayToString([0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0]);  //AB3= 0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0
//				console.log('NewAddress: ' + data.addres);
//			}

//			console.log('PayloadSlice-18-24: ' + (payload.slice(18, 24)));
//			console.log('address :' + ${data.adress} ) 			
			

			// If the command corresponds to a windowcoverings_state capability value set the value to data.windowcoverings_state
			// RFDriver will automatically call this.setCapabilityValue('windowcoverings_state', data.windowcoverings_state);
			if (data.cmd === 'idle' || data.cmd === 'up' || data.cmd === 'down') {
				data.windowcoverings_state = data.cmd;
			}
			// Set data.id to a unique value for this device. Since a remote has an address 
			// and 5 channels and each channel can contain a different blind
			data.id = `${data.address}:${data.channel}`;
			return data;
		}
		return null;
	}

	static dataToPayload(data) {
		if (data) {
			const command = commandMap.get(data.command || data.windowcoverings_state);
			if (command) {
				const address = util.bitStringToBitArray(data.address);
				const channel = util.bitStringToBitArray(data.channel);
				return address.concat(channel, command.split('').map(Number));
			}
		}
		return null;
	}

	// This function is not used since it is more userfriendly and error proof to just copy the remote signal
	static generateData() {
		const data = {
			address: util.generateRandomBitString(18),
			channel: `000000${util.generateRandomBitString(4)}`,
			group: false,
			cmd: 'idle',
		};
		// If random bits were all 0 change the channel to 1
		data.channel = data.channel === '000' ? '001' : data.channel;
		data.id = `${data.address}:${data.channel}`;
		return data;
	}

	onSend(data, payload, frame) {
		if (data.windowcoverings_state) {
			Object.assign(
				// Start with the frame that should be send
				frame,
				// Line below makes sure to set the cmd or direction keys which update the pair wizard
				data.windowcoverings_state === 'idle' ? { cmd: 'idle' } : { direction: data.windowcoverings_state }
			);
		}
		super.onSend(data, payload, frame);
	}

	// This function is not used since it is more userfriendly and error proof to just copy the remote signal
	sendProgramSignal() {
		return this.send({ command: 'p2' })
			.then(() => {
				return new Promise((res) => setTimeout(() => res(this.send({ command: 'p2' })), 1000));
			})
			.then(() => {
				return new Promise((res) => setTimeout(() => res(this.send({ command: 'up' })), 1000));
			});
	}
};

