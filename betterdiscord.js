import BTTVDB from './db/bttv.json' assert { type: 'json' };
import FFZDB from './db/frankerfacez.json' assert { type: 'json' };
import TwitchGlobalDB from './db/twitchglobal.json' assert { type: 'json' };
import TwitchSubscriberDB from './db/twitchsubscriber.json' assert { type: 'json' };

// we're trying to approximate BetterDiscord's current behaivors, so what you'd
// see here might be a bit odd.

const overrides = ['twitch', 'subscriber', 'bttv', 'ffz'];
const modifiers = ['flip', 'spin', 'pulse', 'spin2', 'spin3', '1spin', '2spin', '3spin', 'tr', 'bl', 'br', 'shake', 'shake2', 'shake3', 'flap'];

const Emotes = {
	TwitchGlobal: TwitchGlobalDB,
	TwitchSubscriber: TwitchSubscriberDB,
	BTTV: BTTVDB,
	FrankerFaceZ: FFZDB,
};

function getCategories () {
	// Assume all categories are enabled, this operation might be slightly less
	// expensive than BD's.
	return Object.keys(Emotes).filter((k) => true);
}

function escape (s) {
	return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export function search (string) {
	const result = [];
	const words = string.split(/([^\s]+)([\s]|$)/g);

	for (let c = 0, clen = getCategories().length; c < clen; c++) {
		for (let w = 0, wlen = words.length; w < wlen; w++) {
			const emote = words[w];
			const split = emote.split(':');

			const name = split[0];
			let modifier = split[1] ? split[1] : '';
			let override = modifier.slice(0);

			if (name.length < 4 /* || blocklist.includes(name) */) continue;
			if (!modifiers.includes(modifier)) modifier = '';
			if (!overrides.includes(override)) override = '';
			else modifier = override;

			let current = getCategories()[c];
			if (override === 'twitch') {
				if (Emotes.TwitchGlobal[name]) current = 'TwitchGlobal';
				else if (Emotes.TwitchSubscriber[name]) current = 'TwitchSubscriber';
			}
			else if (override === 'subscriber') {
				if (Emotes.TwitchSubscriber[name]) current = 'TwitchSubscriber';
			}
			else if (override === 'bttv') {
				if (Emotes.BTTV[name]) current = 'BTTV';
			}
			else if (override === 'ffz') {
				if (Emotes.FrankerFaceZ[name]) current = 'FrankerFaceZ';
			}

			if (!Emotes[current][name]) continue;

			// wtf?
			const res = string.match(new RegExp(`([\\s]|^)${escape(modifier ? name + ":" + modifier : name)}([\\s]|$)`));
			if (!res) continue;

			const start = res.index;

			result.push([start, current, name, modifier]);
		}
	}

	return result;
}

