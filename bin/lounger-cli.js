#!/usr/bin/env node

import { lounger } from '../lib/lounger.js';
import nopt from 'nopt';

const parsed = nopt({}, {}, process.argv, 2);

const cmd = parsed.argv.remain.shift();

lounger.load().then(() => {
	lounger.cli[cmd]
		.apply(null, parsed.argv.remain)
		.catch((err) => {
			console.error(err);
		});
}).catch((err) => {
	console.error(err);
});
