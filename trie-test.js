import { Trie } from './trie.js';
import BTTVDB from './db/bttv.json' assert { type: 'json' };
import FFZDB from './db/frankerfacez.json' assert { type: 'json' };
import TwitchGlobalDB from './db/twitchglobal.json' assert { type: 'json' };
import TwitchSubscriberDB from './db/twitchsubscriber.json' assert { type: 'json' };

const lol_start = process.memoryUsage().heapUsed;

const kws = [];

const db = {
	bttv: BTTVDB,
	ffz: FFZDB,
	twitchglobal: TwitchGlobalDB,
	twitchsubscriber: TwitchSubscriberDB,
};

for (const source in db) {
	const emotes = db[source];

	for (const name in emotes) {
		const id = emotes[name];

		kws.push({
			source,
			name,
			id,
		});
	}
}

const string = 'foKappa    a quick brown fox jumps over the lazy     PixelBob:spin dog      Kappa';

const mem_start = process.memoryUsage().heapUsed;
const build_start = performance.now();
const trie = new Trie(kws);
const build_end = performance.now();
const mem_end = process.memoryUsage().heapUsed;

console.log(`build took ${build_end - build_start} ms`);
console.log(`prior heap usage: ${(mem_start - lol_start) / 1024 / 1024} MB`);
console.log(`trie heap usage: ${(mem_end - mem_start) / 1024 / 1024} MB`);

const match_start = performance.now();
const result = trie.search(string);
const match_end = performance.now();

console.log(`match took ${match_end - match_start} ms`);
console.log(string);
console.dir(result, { depth: Infinity });
