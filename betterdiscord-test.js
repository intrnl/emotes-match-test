const mem_start = process.memoryUsage().heapUsed;
const { search } = await import('./betterdiscord.js');
const mem_end = process.memoryUsage().heapUsed;

console.log(`${(mem_end - mem_start) / 1024 / 1024} MB used`);

const match_start = performance.now();

for (let idx = 0; idx < 10_000; idx++) {
	const nodes = ['Kappa Kappa foKappa    a quick brown fox jumps over the lazy     PixelBob:spin dog      Kappa'];
	search(nodes);
}

const match_end = performance.now();

console.log(`took ${match_end - match_start} ms`);
