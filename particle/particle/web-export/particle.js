const MIN_LIFESPAN = 100
const MAX_LIFESPAN = 1000
const MAX_PARTICLES = 100

let system;

function setup() 
{
  createCanvas(800,800);
  sliders = createDiv();
  sliders.position(10, 10); 
  sliders.style('color', 111);
  
  max_particles = createDiv();
  max_particles.position(10, 50);   
  max_particles.style('color', 600) 
  max_particles_label = createElement('span', '');
  max_particles_label.parent(sliders)
  max_particles_slider = createSlider(50, 500, 150);
  max_particles_slider.parent(sliders);

  br = createElement('br')
  br.parent(sliders)

  max_lifespan_label = createElement('span', '');
  max_lifespan_label.parent(sliders)
  max_lifespan_slider = createSlider(MIN_LIFESPAN, MAX_LIFESPAN, 400);
  max_lifespan_slider.parent(sliders);

  br = createElement('br')
  br.parent(sliders)

  lifespan_decay = createDiv();
  lifespan_decay.position(10, 30); 
  lifespan_decay.style('color', 600) 
  lifespan_decay_label = createElement('span', '');
  lifespan_decay_label.parent(sliders)
  lifespan_decay_slider = createSlider(0, 10, 4);
  lifespan_decay_slider.parent(sliders);

  br = createElement('br')
  br.parent(sliders)

  max_acceleration = createDiv();
  max_acceleration.position(10, 70); 
  max_acceleration.style('color', 600) 
  max_acceleration_label = createElement('span', '');
  max_acceleration_label.parent(sliders)
  max_acceleration_slider = createSlider(0.1, 1, 0.1, 0.1);
  max_acceleration_slider.parent(sliders);

  img = loadImage('spaceship.png');

  system = new ParticleSystem(createVector(width / 2, 300));
  system2 = new ParticleSystem(createVector(width, 300));
}

function draw() 
{
  background(120);
  system.addParticle();
  system2.addParticle();

  img.resize(150, 250)
  image(img, width / 2 - img.width / 2, 75)

  max_lifespan_label.elt.innerText = 'Max Lifespan (' + max_lifespan_slider.value() + ') '
  lifespan_decay_label.elt.innerText = 'Lifespan Decay (' + lifespan_decay_slider.value() + ') '
  max_particles_label.elt.innerText = 'Max number of particles (' + max_particles_slider.value() + ') '
  max_acceleration_label.elt.innerText = 'Max acceleration (' + max_acceleration_slider.value() + ') '
  
  system.run();
  system2.run();
}

class FireParticle 
{
  constructor(position) 
  {
    this.max_acceleration = max_acceleration_slider.value();
    this.acceleration = createVector(0, random(0.05, this.max_acceleration));
    this.velocity = createVector(random(-1.5, 1.5), random(-1, 1));
    this.position = position.copy();
    this.max_lifespan = max_lifespan_slider.value();
    this.lifespan = random(MIN_LIFESPAN, this.max_lifespan);
  }

  // run for every particle
  run() 
  {
    this.update();
    this.display();
  }

  // Particle update
  update() 
  {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= lifespan_decay_slider.value();
  }

  // Display particle
  display() 
  {
    stroke(200, this.lifespan);
    strokeWeight(2);

    red = 255;
    green = 255 * (this.lifespanPercent() - 0.2);
    blue = 0

    fill(red, green, blue, this.lifespan);
    ellipse(this.position.x, this.position.y, 50 * this.lifespanPercent(), 50 * this.lifespanPercent());
  }

  isDead() { return this.lifespan < 0; }

  lifespanPercent() { return this.lifespan / this.max_lifespan }
}

// particle system
class ParticleSystem 
{
  constructor(position)
  {
    this.diedLastRound = 0;
    this.origin = position.copy();
    this.particles = [];
  }
  
  addParticle() 
  {
    var toAdd = max_particles_slider.value() - this.diedLastRound - this.particles.length;
    for (var i = 0; i < toAdd; i++) 
    {
      this.particles.push(new FireParticle(this.origin));
    }
  }
  
  run() 
  {
    this.diedLastRound = 0;
    for (var i = this.particles.length - 1; i >= 0; i--) 
    {
      var p = this.particles[i];
      p.run();
      if (p.isDead()) 
      {
        this.diedLastRound++;
        this.particles.splice(i, 1);
      }
    }
  }
}



