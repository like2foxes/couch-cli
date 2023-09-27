'use strict';

import fs from 'fs';
import { default as pkg } from '../package.json' assert { type: 'json' };
import path from 'path';
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const lounger = { loaded: false, load: load};
lounger.version = pkg.version;

const api = {}, cli = {};

Object.defineProperty(lounger, 'commands', {
	get: () => {
		if (lounger.loaded === false) {
			throw new Error('run lounger.load before');
		}
		return api;
	}
});

Object.defineProperty(lounger, 'cli', {
	get: () => {
		if (lounger.loaded === false) {
			throw new Error('run lounger.load before');
		}
		return cli;
	}
});

function load() {
	return new Promise((resolve, reject) => {
		fs.readdir(__dirname, (err, files) => {
			const promises = files.map(async (file) => {
				if (!/\.js$/.test(file) || file === 'lounger.js') {
					return
				}
				const cmd = file.match(/(.*)\.js$/)[1];
				const { cli: c, api: a } = await import(`./${file}`);
				if (c) cli[cmd] = c;
				if (a) api[cmd] = a;
			});
			Promise.all(promises)
				.then(() => {
					lounger.loaded = true;
					resolve(lounger);
				});
		});
	});
}

export { lounger };
