const mem_start = process.memoryUsage().heapUsed;
const { search } = await import('./betterdiscord.js');
const mem_end = process.memoryUsage().heapUsed;

console.log(`${(mem_end - mem_start) / 1024 / 1024} MB used`);

const nodes = ['foKappa    a quick brown fox jumps over the lazy     PixelBob:spin dog      Kappa'];

const match_start = performance.now();
const result = search(nodes);
const match_end = performance.now();

console.log(`match took ${match_end - match_start} ms`);
console.log(nodes);
