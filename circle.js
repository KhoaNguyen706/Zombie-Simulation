var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Circle_x, _Circle_y, _Circle_r, _Circle_dx, _Circle_dy, _Circle_speed, _Circle_div, _Circle_attackcountdown;
// export{}
class Circle {
    /** Takes in x, y, true/false is a zombie or not, optional radius */
    constructor(x, y, isZombie, r = 20) {
        _Circle_x.set(this, void 0);
        _Circle_y.set(this, void 0);
        _Circle_r.set(this, void 0);
        _Circle_dx.set(this, void 0); // add velocity
        _Circle_dy.set(this, void 0); // add velocity
        _Circle_speed.set(this, 2);
        _Circle_div.set(this, void 0);
        // attak function
        _Circle_attackcountdown.set(this, 17);
        __classPrivateFieldSet(this, _Circle_x, x, "f");
        __classPrivateFieldSet(this, _Circle_y, y, "f");
        __classPrivateFieldSet(this, _Circle_r, r, "f");
        __classPrivateFieldSet(this, _Circle_div, document.createElement('div'), "f");
        __classPrivateFieldGet(this, _Circle_div, "f").classList.add('circle');
        __classPrivateFieldGet(this, _Circle_div, "f").style.width = `${r}px`;
        __classPrivateFieldGet(this, _Circle_div, "f").style.height = `${r}px`;
        // zombie clarify
        if (isZombie)
            __classPrivateFieldGet(this, _Circle_div, "f").classList.add('zombie');
        else
            __classPrivateFieldGet(this, _Circle_div, "f").classList.add('human');
        // vector and velocity
        let angle = Math.random() * 2 * Math.PI;
        __classPrivateFieldSet(this, _Circle_dx, Math.cos(angle) * __classPrivateFieldGet(this, _Circle_speed, "f"), "f");
        __classPrivateFieldSet(this, _Circle_dy, Math.sin(angle) * __classPrivateFieldGet(this, _Circle_speed, "f"), "f");
    }
    get x() { return __classPrivateFieldGet(this, _Circle_x, "f"); }
    get y() { return __classPrivateFieldGet(this, _Circle_y, "f"); }
    /** radius */
    get r() { return __classPrivateFieldGet(this, _Circle_r, "f"); }
    /** div */
    get div() { return __classPrivateFieldGet(this, _Circle_div, "f"); }
    /** Returns True iff this Circle is a zombie */
    get isZombie() {
        return this.div.classList.contains('zombie');
    }
    steer(targetX, targetY) {
        const maxForce = 0.05;
        const maxSpeed = 3;
        const dx = targetX - __classPrivateFieldGet(this, _Circle_x, "f");
        const dy = targetY - __classPrivateFieldGet(this, _Circle_y, "f");
        const distance = Math.sqrt(dx * dx + dy * dy);
        const desiredDx = (dx / distance) * maxSpeed;
        const desiredDy = (dy / distance) * maxSpeed;
        const steerX = (desiredDx - __classPrivateFieldGet(this, _Circle_dx, "f")) * maxForce;
        const steerY = (desiredDy - __classPrivateFieldGet(this, _Circle_dy, "f")) * maxForce;
        return [steerX, steerY];
    }
    separate(nearby) {
        const steering_sp = [0, 0];
        let total = 0;
        nearby.forEach(other => {
            const dist = this.distance(other);
            if (other !== this && dist < 30 && dist > 0) {
                let dx = __classPrivateFieldGet(this, _Circle_x, "f") - __classPrivateFieldGet(other, _Circle_x, "f");
                let dy = __classPrivateFieldGet(this, _Circle_y, "f") - __classPrivateFieldGet(other, _Circle_y, "f");
                dx /= dist;
                dy /= dist;
                steering_sp[0] += dx;
                steering_sp[1] += dy;
                total++;
            }
        });
        if (total > 0) {
            steering_sp[0] /= total;
            steering_sp[1] /= total;
            steering_sp[0] -= __classPrivateFieldGet(this, _Circle_dx, "f");
            steering_sp[1] -= __classPrivateFieldGet(this, _Circle_dy, "f");
        }
        return steering_sp;
    }
    cohesion(nearby) {
        const steering_ch = [0, 0];
        let total = 0;
        // Find center of mass of nearby zombies
        nearby.forEach(other => {
            const dist = this.distance(other);
            if (other !== this && dist < 80 && dist > 20) {
                steering_ch[0] += __classPrivateFieldGet(other, _Circle_x, "f");
                steering_ch[1] += __classPrivateFieldGet(other, _Circle_y, "f");
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
    move() {
        // hunt human
        if (this.isZombie) {
            // hunt human
            const humans = circles.filter(x => !x.isZombie);
            if (humans.length > 0) {
                const closest = humans.reduce((a, b) => this.distance(a) < this.distance(b) ? a : b);
                if (this.distance(closest) < 100) {
                    const [steerX, steerY] = this.steer(__classPrivateFieldGet(closest, _Circle_x, "f"), closest.y);
                    __classPrivateFieldSet(this, _Circle_dx, __classPrivateFieldGet(this, _Circle_dx, "f") + steerX * 0.5, "f");
                    __classPrivateFieldSet(this, _Circle_dy, __classPrivateFieldGet(this, _Circle_dy, "f") + steerY * 0.5, "f");
                }
            }
            // sperate
            const nearby = circles.filter(x => x.isZombie && x !== this && this.distance(x) < 100);
            const [spex, spey] = this.separate(nearby);
            __classPrivateFieldSet(this, _Circle_dx, __classPrivateFieldGet(this, _Circle_dx, "f") + spex * 0.4, "f");
            __classPrivateFieldSet(this, _Circle_dy, __classPrivateFieldGet(this, _Circle_dy, "f") + spey * 0.4, "f");
            // conhension
            const [cohX, cohY] = this.cohesion(nearby);
            __classPrivateFieldSet(this, _Circle_dx, __classPrivateFieldGet(this, _Circle_dx, "f") + cohX * 0.5, "f"); // Cohesion force
            __classPrivateFieldSet(this, _Circle_dy, __classPrivateFieldGet(this, _Circle_dy, "f") + cohY * 0.5, "f");
            // limit speed
            const speed = Math.sqrt(__classPrivateFieldGet(this, _Circle_dx, "f") * __classPrivateFieldGet(this, _Circle_dx, "f") + __classPrivateFieldGet(this, _Circle_dy, "f") * __classPrivateFieldGet(this, _Circle_dy, "f"));
            if (speed > __classPrivateFieldGet(this, _Circle_speed, "f")) {
                __classPrivateFieldSet(this, _Circle_dx, (__classPrivateFieldGet(this, _Circle_dx, "f") / speed) * __classPrivateFieldGet(this, _Circle_speed, "f"), "f");
                __classPrivateFieldSet(this, _Circle_dy, (__classPrivateFieldGet(this, _Circle_dy, "f") / speed) * __classPrivateFieldGet(this, _Circle_speed, "f"), "f");
            }
        }
        // human move
        __classPrivateFieldSet(this, _Circle_x, __classPrivateFieldGet(this, _Circle_x, "f") + __classPrivateFieldGet(this, _Circle_dx, "f"), "f");
        __classPrivateFieldSet(this, _Circle_y, __classPrivateFieldGet(this, _Circle_y, "f") + __classPrivateFieldGet(this, _Circle_dy, "f"), "f");
        if (__classPrivateFieldGet(this, _Circle_x, "f") <= 0 || __classPrivateFieldGet(this, _Circle_x, "f") >= 800)
            __classPrivateFieldSet(this, _Circle_dx, __classPrivateFieldGet(this, _Circle_dx, "f") * -1, "f");
        if (__classPrivateFieldGet(this, _Circle_y, "f") <= 0 || __classPrivateFieldGet(this, _Circle_y, "f") >= 600)
            __classPrivateFieldSet(this, _Circle_dy, __classPrivateFieldGet(this, _Circle_dy, "f") * -1, "f");
    }
    /** doesn't draw directly, rather it updates the divs css */
    draw() {
        this.div.style.left = `${__classPrivateFieldGet(this, _Circle_x, "f") - this.r / 2}px`;
        this.div.style.top = `${this.y - this.r / 2}px`;
    }
    infect() {
        this.div.classList.remove('human');
        this.div.classList.add('zombie');
        // Flash effect
        this.div.classList.add('flash');
        setTimeout(() => this.div.classList.remove('flash'), 300);
        spawnEffect(__classPrivateFieldGet(this, _Circle_x, "f"), __classPrivateFieldGet(this, _Circle_y, "f"), 'red');
    }
    uninfect() {
        this.div.classList.remove('zombie');
        this.div.classList.add('human');
    }
    /** returns the distance between two circles */
    distance(other) {
        return Math.pow((Math.pow((__classPrivateFieldGet(this, _Circle_x, "f") - __classPrivateFieldGet(other, _Circle_x, "f")), 2) + Math.pow((this.y - other.y), 2)), .5);
    }
    // **attack function for human
    attack(zombie) {
        var _a;
        if (__classPrivateFieldGet(this, _Circle_attackcountdown, "f") <= 0 && Math.random() < 0.25) {
            __classPrivateFieldSet(this, _Circle_attackcountdown, 35, "f");
            return true;
        }
        else {
            __classPrivateFieldSet(this, _Circle_attackcountdown, (_a = __classPrivateFieldGet(this, _Circle_attackcountdown, "f"), _a--, _a), "f");
            return false;
        }
    }
}
_Circle_x = new WeakMap(), _Circle_y = new WeakMap(), _Circle_r = new WeakMap(), _Circle_dx = new WeakMap(), _Circle_dy = new WeakMap(), _Circle_speed = new WeakMap(), _Circle_div = new WeakMap(), _Circle_attackcountdown = new WeakMap();
function spawnEffect(x, y, color) {
    const splat = document.createElement('div');
    splat.classList.add('splat');
    splat.style.left = `${x}px`;
    splat.style.top = `${y}px`;
    splat.style.backgroundColor = color;
    document.body.appendChild(splat);
    setTimeout(() => {
        splat.remove();
    }, 500);
}
