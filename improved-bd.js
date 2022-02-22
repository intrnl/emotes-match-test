import TwitchGlobalDB from './db/twitchglobal.json' assert { type: 'json' };
import TwitchSubscriberDB from './db/twitchsubscriber.json' assert { type: 'json' };
import BTTVDB from './db/bttv.json' assert { type: 'json' };
import FFZDB from './db/frankerfacez.json' assert { type: 'json' };

const modifiers = ['flip', 'spin', 'pulse', 'spin2', 'spin3', '1spin', '2spin', '3spin', 'tr', 'bl', 'br', 'shake', 'shake2', 'shake3', 'flap'];

const Emotes = {
	twitch: TwitchGlobalDB,
	subscriber: TwitchSubscriberDB,
	bttv: BTTVDB,
	ffz: FFZDB,
};

// possible emote variations:
// Kappa
// Kappa:spin
// Kappa:ffz
// Kappa:ffz:spin

const STATE_NORMAL = 0; // consume `emote`
const STATE_OVERRIDE = 1; // consume either `override` or `modifier`
const STATE_MODIFIER = 2; // consume `modifier`

export function search (string) {
	const result = [];

	let idx = 0;
	let len = string.length;

	while (idx < len) {
		const start_idx = idx;
		let state = STATE_NORMAL;

		let name = '';
		let override = '';
		let modifier = '';

		let mismatch = false;

		while (idx < len) {
			const char = string[idx];

			if (isWhitespace(char)) {
				break;
			}

			if (char === ':') {
				// Kappa:foo:bar:baz
				//              ^
				if (state >= STATE_MODIFIER) {
					mismatch = true;
					break;
				}

				state++;
				idx++;
				continue;
			}

			if (state === STATE_NORMAL) {
				name += char;
			}
			else if (state === STATE_OVERRIDE) {
				override += char;
			}
			else if (state === STATE_MODIFIER) {
				modifier += char;
			}

			idx++;
		}

		if (mismatch) {
			// eat through non-whitespace
			while (idx < len && !isWhitespace(string[idx])) {
				idx++;
			}
		}

		// eat through whitespace
		while (idx < len && isWhitespace(string[idx])) {
			idx++;
		}

		if (mismatch || name.length < 4) {
			continue;
		}

		if (!override || !(override in Emotes)) {
			modifier = override;

			// go through each source and see if we can find a match
			for (let source in Emotes) {
				const emotes = Emotes[source];

				if (name in emotes) {
					override = source;
					break;
				}
			}

			if (!override) {
				continue;
			}
		} else if (!(name in Emotes[override])) {
			continue;
		}

		if (!modifier || !modifiers.includes(modifier)) {
			if (state >= STATE_MODIFIER) {
				continue;
			}

			modifier = null;
		}

		result.push([start_idx, override, name, modifier]);
	}

	return result;
}

function isWhitespace (char) {
	return char === ' ' || char === '\n';
}
