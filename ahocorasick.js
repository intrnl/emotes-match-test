/**
 * @typedef {object} Emote
 * @property {string} name
 * @property {string} source
 * @property {string} id
 */

const modifiers = ['flip', 'spin', 'pulse', 'spin2', 'spin3', '1spin', '2spin', '3spin', 'tr', 'bl', 'br', 'shake', 'shake2', 'shake3', 'flap'];

export class Trie {
	#dict;
	#out;
	#fail;

	constructor (emotes) {
		this.#build(emotes);
	}

	#build (emotes) {
		const dict = { 0: {} };
		const out = {};

		let state = 0;

		for (const emote of emotes) {
			const name = emote.name;
			let curr = 0;

			for (let idx = 0, len = name.length; idx < len; idx++) {
				const char = name[idx];

				if (dict[curr] && dict[curr][char]) {
					curr = dict[curr][char];
				}
				else {
					state++;

					dict[curr][char] = state;
					dict[state] = {};

					curr = state;
					out[state] = [];
				}
			}

			out[curr].push(emote);
		}

		const fail = {};
		const xs = [];

		for (const char in dict[0]) {
			const state = dict[0][char];
			fail[state] = 0;
			xs.push(state);
		}

		while (xs.length) {
			const x = xs.shift();

			for (const char in dict[x]) {
				const s = dict[x][char];
				xs.push(s);

				let state = fail[x];

				while (state > 0 && !dict[state][char]) {
					state = fail[state];
				}

				if (dict[state][char]) {
					const fs = dict[state][char];
					fail[s] = fs;
					out[s].push(...out[fs]);
				}
				else {
					fail[s] = 0;
				}
			}
		}

		this.#dict = dict;
		this.#out = out;
		this.#fail = fail;
	}

	search (string) {
		const dict = this.#dict;
		const out = this.#out;
		const fail = this.#fail;

		const results = [];
		let state = 0;

		for (let idx = 0, len = string.length; idx < len; idx++) {
			const char = string[idx];

			while (state > 0 && !dict[state][char]) {
				state = fail[state];
			}

			if (!dict[state][char]) {
				while (idx < len) {
					if (isWhitespace(string[idx])) {
						break;
					}

					idx++;
				}

				continue;
			}

			state = dict[state][char];

			// we're trying to match whole words only, skip if the next character is
			// not whitespace, or colon (this is for modifiers)
			const next_char = string[idx + 1];

			if (next_char && !isWhitespace(next_char) && next_char !== ':') {
				continue;
			}

			if (out[state].length) {
				const kws = out[state];
				let modifier = null;

				// we support modifiers, an example would be Kappa:spin, where it would
				// make the emote spin endlessly
				if (next_char === ':') {
					idx += 2;

					let str = '';

					// match until we encounter whitespace
					while (idx < len) {
						const char = string[idx];

						if (isWhitespace(char)) {
							break;
						}

						str += char;
						idx++;
					}

					if (str && modifiers.includes(str)) {
						modifier = str;
					}
				}

				results.push([idx, kws, modifier]);
			}
		}

		return results;
	}
}

function isWhitespace (char) {
	return char === ' ' || char === '\n';
}
