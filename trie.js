/**
 * @typedef {object} Emote
 * @property {string} name
 * @property {string} source
 * @property {string} id
 */

const modifiers = ['flip', 'spin', 'pulse', 'spin2', 'spin3', '1spin', '2spin', '3spin', 'tr', 'bl', 'br', 'shake', 'shake2', 'shake3', 'flap'];

export class Trie {
	dict = {};

	constructor (emotes) {
		for (const emote of emotes) {
			this.#add(emote);
		}
	}

	#add (emote) {
		const name = emote.name;
		let dict = this.dict;

		for (let idx = 0, len = name.length; idx < len; idx++) {
			const char = name[idx];

			if (!dict[char]) {
				dict[char] = {};
			}

			dict = dict[char];
		}

		(dict.$$ ||= {})[emote.source] = emote.id;
	}

	search (string) {
		const dict = this.dict;
		const results = [];

		let curr = dict;

		for (let idx = 0, len = string.length; idx < len; idx++) {
			const char = string[idx];
			const next_char = string[idx + 1];

			// no match, reset dict and skip to the next word
			if (!curr[char]) {
				curr = dict;

				while (idx < len) {
					if (isWhitespace(string[idx])) {
						break;
					}

					idx++;
				}

				continue;
			}

			curr = curr[char];

			// we're trying to match whole words only, so if we're at the end of the
			// string, or if the next character is either a whitespace or colon, then
			// we're done
			if (idx === len - 1 || isWhitespace(next_char) || next_char === ':') {
				const kws = curr.$$;
				curr = dict;

				if (!kws) {
					continue;
				}

				// we support modifiers, e.g Kappa:spin, which makes the emote spin.
				let modifier = null;

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

				results.push([idx + 1, kws, modifier]);
			}
		}

		return results;
	}
}

function isWhitespace (char) {
	return char === ' ' || char === '\n';
}
