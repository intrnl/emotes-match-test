const mem_start = process.memoryUsage().heapUsed;
const { search } = await import('./betterdiscord.js');
const mem_end = process.memoryUsage().heapUsed;

const string = 'foKappa    a quick brown fox jumps over the lazy     PixelBob:spin dog      Kappa';

const match_start = performance.now();
const result = search(string);
const match_end = performance.now();

console.log(`${(mem_end - mem_start) / 1024 / 1024} MB used`);
console.log(`match took ${match_end - match_start} ms`);
console.log(string);
console.dir(result, { depth: Infinity });
