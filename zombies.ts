const zdome = document.getElementById('zombie-dome')!


const circles = [...Array(120)].map(x => 
new Circle(Math.random()*600, Math.random()*600, Math.random()<.1)
    );
    
    
    circles.forEach(c => {
    zdome.appendChild(c.div);
        c.draw();
    });
    
    

let count_inflect: number = 0;
let count_time:number = 0;
const test = document.getElementById("inflectionCounter");
const time = document.getElementById("time")
// Initial simulation setup


setInterval(()=>{
    circles.forEach(c => c.move());
    const zombies = circles.filter(x => x.isZombie);
    const humans = circles.filter(x => !x.isZombie);
    zombies.forEach(z => {
        humans.forEach(h => {
            if (z.distance(h) < 10) {
                h.infect();
                if(h.isZombie) {
                    count_inflect++;
                    test!.innerHTML = `There have been ${count_inflect} inflections`;
                    console.log('Human inflec');
                }
            }
        });
    });
    circles.forEach(c => c.draw());
    count_time++;
    if(humans.length>0) time!.innerHTML=`Time Spread: ${Math.floor(count_time*30/1000)}s`
},30)
setInterval(()=>{
    const zombie= circles.filter(x=>x.isZombie)
    const humans = circles.filter(x=>!x.isZombie)
    let medic = Math.random()*100;
    if(humans.length>0){
    if (medic<=10 && zombie.length>0 ){
        let randomIndex = Math.floor(Math.random()*zombie.length);
        let luckyZombie = zombie[randomIndex];
        luckyZombie.uninfect();
        count_inflect--;
        if(test) {
            test.innerHTML = `There have been ${count_inflect} inflections`;
        }
    }}
},100)
// Reset button handler
const reset = document.getElementById('reset');
reset!.addEventListener('click', () => {
    // clearInterval(intervalId);
    // initSimulation();
    // intervalId = setInterval(gameLoop, 30);
    location.reload();
});
