// export{}
class Circle{
    #x: number
    #y: number
    #r: number
    #dx:number // add velocity
    #dy:number // add velocity
    #speed:number=2;
    #div: HTMLDivElement
    /** Takes in x, y, true/false is a zombie or not, optional radius */
    constructor(x:number, y:number, isZombie:boolean, r: number = 20){
        this.#x = x;
        this.#y = y;
        this.#r = r;
        this.#div = document.createElement('div')
        this.#div.classList.add('circle')
        this.#div.style.width=`${r}px`
        this.#div.style.height=`${r}px`
        if(isZombie) this.#div.classList.add('zombie')
        else this.#div.classList.add('human')
        let angle = Math.random()*2 * Math.PI;
        this.#dx=Math.cos(angle)* this.#speed;
        this.#dy=Math.sin(angle)* this.#speed;
    }
    /** x coordinate */
    get x()  : number{ return this.#x }
    /** y coordinate */
    get y()  : number{ return this.#y }
    /** radius */
    get r()  : number{ return this.#r }
    /** div */
    get div(): HTMLDivElement{ return this.#div}
    /** Returns True iff this Circle is a zombie */
    
    get isZombie(): boolean {
        return this.div.classList.contains('zombie')
    }
    protected steer(targetX:number,targetY:number):[number,number]{
            const maxForce = 0.05;
            const maxSpeed = 3;
            const dx = targetX - this.#x;
            const dy = targetY - this.#y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const desiredDx = (dx / distance) * maxSpeed;
            const desiredDy = (dy / distance) * maxSpeed;
            const steerX = (desiredDx - this.#dx) * maxForce;
            const steerY = (desiredDy - this.#dy) * maxForce;
            
            return [steerX, steerY];
    }
    protected separate(nearby:Circle[]):number[]{
        const steering_sp = [0,0];
        let total =0;
        nearby.forEach(other=>{
            const dist = this.distance(other);
            if (other !==this && dist<30 && dist>0){
                let dx = this.#x-other.#x;
                let dy = this.#y-other.#y;
                dx/=dist;
                dy/=dist;
                steering_sp[0]+=dx;
                steering_sp[1]+=dy
                total++;
  
            }
        })
        if(total>0){
            steering_sp[0]/=total;
            steering_sp[1]/=total;
            steering_sp[0]-=this.#dx;
            steering_sp[1]-=this.#dy;
        }
        return steering_sp;
    }
    protected cohesion(nearby: Circle[]): number[] {
        const steering_ch = [0,0];
        let total = 0;

        // Find center of mass of nearby zombies
        nearby.forEach(other => {
            const dist = this.distance(other);
            if (other !== this && dist < 80 && dist > 20) {
                steering_ch[0] += other.x;
                steering_ch[1] += other.y;
                total++;
            }
        });

        if (total > 0) {
            // Calculate center of mass
            steering_ch[0] /= total;
            steering_ch[1] /= total;
            
            // Get steering force towards center
            const [steerX, steerY] = this.steer(steering_ch[0], steering_ch[1]);
            return [steerX * 0.15, steerY * 0.15]; // Reduce cohesion strength
        }

        return [0, 0];
    }
    /** moves the zombie randomly within 5px in both x and y (+/-) */
    move() : void{
        // hunt human
        if(this.isZombie){
            // hunt human
            const humans = circles.filter(x=>!x.isZombie);
            if(humans.length >0){
                const closest = humans.reduce((a,b)=>this.distance(a)<this.distance(b)?a:b)
                if(this.distance(closest)<100){
                    const [steerX, steerY] = this.steer(closest.x, closest.y);
                    this.#dx += steerX*0.5;
                    this.#dy += steerY*0.5;
                }
            }
            // sperate
            const nearby=circles.filter(x=>x.isZombie && x!==this && this.distance(x)<100);
            const [spex,spey]=this.separate(nearby);
            this.#dx+=spex*0.4;
            this.#dy+=spey*0.4;
            // conhension
            const [cohX, cohY] = this.cohesion(nearby);
            this.#dx += cohX * 0.5;  // Cohesion force
            this.#dy += cohY * 0.5;

            // limit speed
            const speed = Math.sqrt(this.#dx * this.#dx + this.#dy * this.#dy);
            if(speed > this.#speed) {
                this.#dx = (this.#dx / speed) * this.#speed;
                this.#dy = (this.#dy / speed) * this.#speed;
            }
        }
 
        // human move
        this.#x += this.#dx
        this.#y += this.#dy
        if (this.#x <= 0 || this.#x >= 800) this.#dx *= -1
        if (this.#y <= 0 || this.#y >= 600) this.#dy *= -1
    }
    /** doesn't draw directly, rather it updates the divs css */
    draw() : void{
        this.div.style.left = `${this.x-this.r/2}px`;
        this.div.style.top = `${this.y-this.r/2}px`;
    }
    infect() : void{
        this.div.classList.remove('human');
        this.div.classList.add('zombie');
    }
    uninfect(): void {
        this.div.classList.remove('zombie');
        this.div.classList.add('human');
    }
    
    /** returns the distance between two circles */
    distance(other : Circle) : number{
        return ((this.x-other.x)**2+(this.y-other.y)**2)**.5
    }
}
