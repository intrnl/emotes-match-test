// Basically, we take the first two letters of the emote as a node,
// so if we have an emote like Kappa, it will be stored like:
// { 'Ka': 'ppa': { twitchglobal: 25 } }

const modifiers = ['flip', 'spin', 'pulse', 'spin2', 'spin3', '1spin', '2spin', '3spin', 'tr', 'bl', 'br', 'shake', 'shake2', 'shake3', 'flap'];

const first_len = 3;

export class NotATrie {
	dict = {};

	constructor (emotes) {
		for (const emote of emotes) {
			this.#add(emote);
		}
	}

	#add (emote) {
		const dict = this.dict;

		const name = emote.name;
		const first = name.slice(0, first_len);
		const last = name.slice(first_len);

		((dict[first] ||= {})[last] ||= {})[emote.source] = emote.id;
	}

	search (string) {
		const dict = this.dict;
		const results = [];

		const len = string.length;
		let idx = 0;

		while (idx < len) {
			const start_idx = idx;

			const first = string.slice(idx, idx + first_len);
			const next = dict[first];

			if (!next) {
				// jump to the next whitespace
				while (idx < len) {
					if (isWhitespace(string[idx])) {
						break;
					}

					idx++;
				}

				// consume all whitespace
				while (idx < len) {
					if (!isWhitespace(string[idx])) {
						break;
					}

					idx++;
				}

				continue;
			}

			// find whitespace, or colon, or end of string
			let end_idx = idx + first_len;

			while (end_idx < len) {
				if (isWhitespace(string[end_idx]) || string[end_idx] === ':') {
					break;
				}

				end_idx++;
			}

			const last = string.slice(idx + first_len, end_idx);
			const kws = next[last];

			idx = end_idx;

			if (!kws) {
				continue;
			}

			// we can have modifiers, for example, Kappa:spin makes the emote spin
			let modifier = null;

			if (idx < len && string[idx] === ':') {
				idx++;

				// we'll match until we encounter whitespace
				let str = '';

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

			results.push([start_idx, kws, modifier]);
		}

		return results;
	}
}

function isWhitespace (char) {
	return char === ' ' || char === '\n';
}
