const zdome = document.getElementById('zombie-dome');
// Initialize circles array
let circles = [...Array(200)].map(x => new Circle(Math.random() * 600, Math.random() * 600, Math.random() < .1));
circles.forEach(c => {
    zdome.appendChild(c.div);
    c.draw();
});
// Initialize counters
let count_inflect = 0;
let count_time = 0;
let zombie_count = circles.filter(x => x.isZombie).length;
let humans_count = circles.filter(x => !x.isZombie).length;
// Get DOM elements
const test = document.getElementById("inflectionCounter");
const time = document.getElementById("time");
const humans_count_text = document.getElementById("count_human");
const zombie_count_text = document.getElementById("count_zombie");
// Main game loop
const gameLoopId = setInterval(() => {
    circles.forEach(c => c.move());
    // Get current zombies and humans
    const zombies = circles.filter(x => x.isZombie);
    const humans = circles.filter(x => !x.isZombie);
    zombies.forEach(z => {
        humans.forEach(h => {
            // Handle infections
            if (z.distance(h) <= 10) {
                h.infect();
                if (h.isZombie) {
                    count_inflect++;
                    zombie_count++;
                    humans_count--;
                    updateCounters();
                }
            }
            // Handle attacks
            if (h.distance(z) <= 20) {
                if (h.attack(z)) {
                    // Actually remove zombie from array
                    circles = circles.filter(x => x !== z);
                    zombie_count--;
                    count_inflect--;
                    updateCounters();
                    spawnEffect(z.x, z.y, 'black');
                    z.div.remove();
                }
            }
        });
    });
    circles.forEach(c => c.draw());
    count_time++;
    if (humans.length > 0) {
        time.innerHTML = `Time Spread: ${Math.floor(count_time * 30 / 1000)}s`;
    }
}, 30);
// Medic loop
const medicLoopId = setInterval(() => {
    const zombies = circles.filter(x => x.isZombie);
    const humans = circles.filter(x => !x.isZombie);
    if (humans.length > 0) {
        let medic = Math.random();
        if (medic < 0.1) {
            const zombies = circles.filter(x => x.isZombie);
            if (zombies.length > 0) {
                let randomIndex = Math.floor(Math.random() * zombies.length);
                let luckyZombie = zombies[randomIndex];
                luckyZombie.uninfect();
                zombie_count--;
                humans_count++;
                updateCounters();
            }
        }
    }
}, 100);
// Helper function to update counter displays
function updateCounters() {
    test.innerHTML = `There have been ${Math.max(0, count_inflect)} inflections`;
    zombie_count_text.innerHTML = `Current zombies: ${Math.max(0, zombie_count)}`;
    humans_count_text.innerHTML = `Current humans: ${Math.max(humans_count, 0)}`;
}
// Reset button handler
const reset = document.getElementById('reset');
reset.addEventListener('click', () => {
    clearInterval(gameLoopId);
    clearInterval(medicLoopId);
    location.reload();
});
