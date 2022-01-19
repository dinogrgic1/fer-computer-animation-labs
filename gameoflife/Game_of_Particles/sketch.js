const WINDOW_HEIGHT = 600;
const WINDOW_WIDTH = 600;

const BALL_SIZE = 20;
const BORDER_WIDTH = 20;

const MIN_LIFESPAN = 100;
const MAX_LIFESPAN = 1000;
const MAX_PARTICLES = 400;
const MAX_VELOCITY = 1.5;

let system;

function setup() {
  createCanvas(WINDOW_HEIGHT + BORDER_WIDTH, WINDOW_WIDTH + BORDER_WIDTH);
  sliders = createDiv();
  sliders.position(10, 10);
  sliders.style("color", 111);

  max_particles = createDiv();
  max_particles.position(10, 50);
  max_particles.style("color", 600);
  max_particles_label = createElement("span", "");
  max_particles_label.parent(sliders);
  max_particles_slider = createSlider(15, MAX_PARTICLES, 1);
  max_particles_slider.parent(sliders);
  
  brk = createElement("br", "");
  brk.parent(sliders)

  max_friction = createDiv();
  max_friction.position(10, 10);
  max_friction.style("color", 600);
  max_friction_label = createElement("span", "");
  max_friction_label.parent(sliders);
  max_friction_slider = createSlider(0, 0.01, 0.005, 0.00005);
  max_friction_slider.parent(sliders);
  
  system = new ParticleSystem(createVector(width / 2, 300));
}

function draw() {
  background(120);
  system.addParticle();

  max_particles_label.elt.innerText =
    "Number of particles (" + max_particles_slider.value() + ") ";
  
    max_friction_label.elt.innerText =
    "Max friction coeficient (" + max_friction_slider.value().toFixed(6) + ") ";


  system.run();
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Particle {
  constructor(system, position, colorChoice) {
    this.system = system;

    if (colorChoice == 0) {
      this.color = [255, 0, 0];
      this.force = Math.random(0, 0.0002);
    }

    if (colorChoice == 1) {
      this.color = [0, 255, 0];
      this.force = -Math.random(0, 0.0002);
    }

    if (colorChoice == 2) {
      this.color = [0, 0, 255];
      this.force = -1;
    }

    this.velocity = createVector(random(-MAX_VELOCITY, MAX_VELOCITY), random(-MAX_VELOCITY, MAX_VELOCITY))
    this.position = position.copy();
  }

  // run for every particle
  run() {
    this.update();
    this.display();
  }
  
  // wallCollision for particles
  wallCollision() {
    if (this.position.x < BORDER_WIDTH) {
      this.velocity.x = -this.velocity.x;
      this.x = BORDER_WIDTH;
    } else if (this.position.x >= WINDOW_WIDTH - BORDER_WIDTH) {
      this.velocity.x = -this.velocity.x;
      this.x = WINDOW_WIDTH - BORDER_WIDTH;
    }

    if (this.position.y < BORDER_WIDTH) {
      this.velocity.y = -this.velocity.y;
      this.y = BORDER_WIDTH;
    } else if (this.position.y >= WINDOW_HEIGHT - BORDER_WIDTH) {
      this.velocity.y = -this.velocity.y;
      this.y = WINDOW_HEIGHT - BORDER_WIDTH;
    }
  }

  particleCollision(system) {
    for (var i = system.particles.length - 1; i >= 0; i--) {
      var p = system.particles[i];
      
      var delta_x = p.position.x - this.position.x;
      var delta_y = p.position.y - this.position.y;
      
      
      const distance = delta_x * delta_x + delta_y * delta_y;
      const r = Math.sqrt(distance);

      if (r > 0.0001 && r <= BALL_SIZE) {
        delta_x /= r;
        delta_y /= r
        
        var add_vel_x = this.force * delta_x;
        var add_vel_y = this.force * delta_y;

        this.velocity.x += add_vel_x;
        this.velocity.y += add_vel_y;
      }
    }
  }

  // Particle update
  update() {
    this.wallCollision();
    this.particleCollision(this.system); 
    
    var friction = max_friction_slider.value();
    this.velocity.x *= 1.00 - friction
    this.velocity.y *= 1.00 - friction
    
    this.position.add(this.velocity);
  }

  // Display particle
  display() {
    stroke(200, 100);
    strokeWeight(2);
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.position.x, this.position.y, BALL_SIZE, BALL_SIZE);
  }
}

// particle system
class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
  }

  addParticle() {
    var randomPosition = { x: this.origin.x, y: this.origin.y };
    var toAdd =
      max_particles_slider.value() - this.particles.length;

    if (toAdd < 0) {
      this.particles.pop();  
    }
    for (var i = 0; i < toAdd; i++) {
      var createPosition = this.origin.copy();
      createPosition.x = random(BORDER_WIDTH, WINDOW_WIDTH - BORDER_WIDTH);
      createPosition.y = random(BORDER_WIDTH, WINDOW_HEIGHT - BORDER_WIDTH);
      var colorChoice = randomInteger(0, 2);
      this.particles.push(new Particle(this, createPosition, colorChoice));
    }
  }

  run() {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i].run();
    }
  }
}
