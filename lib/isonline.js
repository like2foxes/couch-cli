'use strict';

import request from 'request';

function isOnline(url) {
	return new Promise((resolve, reject) => {
		request({
			uri: url,
			json: true,
		}, (err, res, body) => {
			if (
				err &&
				(err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
				return resolve({ [url]: false });
			}
			if (err) {
				return reject(err);
			}
			const isDatabase = (
				body.couchdb === 'Welcome' ||
				body['express-pouchdb'] === 'Welcome!'
			)
			return resolve({ [url]: isDatabase });
		});
	});
}

function cli (url) {
	return new Promise((resolve, reject) => {
		isOnline(url).then((results) => {
			Object.keys(results).forEach((entry) => {
				let msg = 'seems to be offline';
				if(results[entry]) {
					msg = 'seems to be online';
				}

				console.log(entry, msg);
				resolve(results);
			});
		});

	});
}

export { cli, isOnline as api };
