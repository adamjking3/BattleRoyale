// const random = require('scripts/server/random');

MyGame.renderer.ParticleSystem = (function(graphics, assets) {
	let that = {};
	that.systems = [];

	that.createParticle = function(shield, specs) {
		let particlePack = {};
		let particles = [];
		particlePack.spec = {
			position: { x: specs.x, y: specs.y},
			speed: { mean: 0.07, stdev: 0.025},
			lifetime: { mean: 5000, stdev: 1000 },
			size: { mean: 10, stdev: 2 }
		}
		// initialize particles
		for (let particle = 0; particle < 20; particle++) {
			let p = {
				position: { x: particlePack.spec.position.x, y: particlePack.spec.position.y },
        direction: nextCircleVector(),
				// direction: Random.nextCircleVector(),
        speed: nextGaussian( particlePack.spec.speed.mean, particlePack.spec.speed.stdev ),	// pixels per millisecond
				// speed: Random.nextGaussian( particlePack.spec.speed.mean, particlePack.spec.speed.stdev ),	// pixels per millisecond
        lifetime: nextGaussian(particlePack.spec.lifetime.mean, particlePack.spec.lifetime.stdev),	// milliseconds
				// lifetime: Random.nextGaussian(particlePack.spec.lifetime.mean, particlePack.spec.lifetime.stdev),	// milliseconds
				alive: 0,
        size: nextGaussian(particlePack.spec.size.mean, particlePack.spec.size.stdev),
				// size: Random.nextGaussian(particlePack.spec.size.mean, particlePack.spec.size.stdev),
			};
			particles.push(p);
		}
		// set up image
		particlePack.image = assets['light-particle'];

    // set up update function
		particlePack.update = function(elapsedTime) {
			let keepMe = [];
			for (let particle = 0; particle < particles.length; particle++) {
				particles[particle].alive += elapsedTime;
				particles[particle].position.x += (elapsedTime * particles[particle].speed * particles[particle].direction.x);
				particles[particle].position.y += (elapsedTime * particles[particle].speed * particles[particle].direction.y);

				if (particles[particle].alive <= particles[particle].lifetime) {
					keepMe.push(particles[particle]);
				}
			}
			if (keepMe.length) {
				particles = keepMe;
				return true;
			} else {
				return false;
			}
		};

    particlePack.render = function(player) {
      let mapWidth = 15 * 512;
      // for (let particle = 0; particle < particles.length; particle++) {
      //   if (particles[particle].alive >= 100) {
      //     let part = particles[particle];
      //     graphics.drawImage(particlePack.image,
      //       (part.position.x * mapWidth) - (player.position.x * mapWidth),
      //       (part.position.y * mapWidth) - (player.position.y * mapWidth),
      //       part.size, part.size, true);
      //   }
      // }
    }

    function nextCircleVector(scale = 1) {
      let angle = Math.random() * 2 * Math.PI;

      return {
        x: Math.cos(angle) * scale,
        y: Math.sin(angle) * scale,
      };
    }

    function nextGaussian(mean, stdDev) {
      let x1 = 0,
        x2 = 0,
        y1 = 0,
        z = 0;

      do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        z = x1 * x1 + x2 * x2;
      } while (z >= 1);

      z = Math.sqrt(-2 * Math.log(z) / z);
      y1 = x1 * z;
      y2 = x2 * z;

      return mean + y1 * stdDev;
    }

		return particlePack;
  }




	that.update = function(elapsedTime, shield) {
    if (Object.keys(shield).length > 0) {
      let points = {};
      let left = graphics.viewport.left;
      let top = graphics.viewport.top;
      let width = graphics.world.width;
      let height = graphics.world.height;

      points['p1'] = {
        x: left, y: top,
      };
      points['p2'] = {
        x: left + width, y: top,
      };
      points['p3'] = {
        x: left + width, y: top + height,
      };
      points['p4'] = {
        x: left, y: top + height,
      };
      // check for quad1
      // console.log(points[0])
      let draw = false;
      for (let p in points) {
        if (points[p].x >= shield.x && points[p].y >= shield.y) {
          console.log('QUAD1');
          draw = true;
          break;
        }
      }
      if (draw) {
        for (let i = 0; i < shield.radius * 1; i ++) {
          let randomAngle = Math.floor(Math.random() * 90);
          that.systems.push(that.createParticle(shield, {
            x: Math.cos(randomAngle) * shield.radius,
            y: Math.sin(randomAngle) * shield.radius,
          }));
        }
      }
      // check for quad2
      draw = false;
      for (let p in points) {
        if (points[p].x <= shield.x && points[p].y >= shield.y) {
          draw = true;
          console.log('QUAD2');
          break;
        }
      }
      if (draw) {
        for (let i = 0; i < shield.radius * 1; i ++) {
          let randomAngle =Math.floor(Math.random() * 90) + 90;
          that.systems.push(that.createParticle(shield, {
            x: Math.cos(randomAngle) * shield.radius,
            y: Math.sin(randomAngle) * shield.radius,
          }));
        }
      }
      // check for quad3
      draw = false;
      for (let p in points) {
        if (points[p].x <= shield.x && points[p].y <= shield.y) {
          console.log('QUAD3');
          draw = true;
          break;
        }
      }
      if (draw) {
        for (let i = 0; i < shield.radius * 1; i ++) {
          let randomAngle =Math.floor(Math.random() * 90) + 180;
          that.systems.push(that.createParticle(shield, {
            x: Math.cos(randomAngle) * shield.radius,
            y: Math.sin(randomAngle) * shield.radius,
          }));
        }
      }

      // check for quad4
      draw = false;
      for (let p in points) {
        if (points[p].x >= shield.x && points[p].y <= shield.y) {
          console.log('QUAD4');
          draw = true;
          break;
        }
      }
      if (draw) {
        for (let i = 0; i < shield.radius * 1; i ++) {
          let randomAngle =Math.floor(Math.random() * 90) + 270;
          that.systems.push(that.createParticle(shield, {
            x: Math.cos(randomAngle) * shield.radius,
            y: Math.sin(randomAngle) * shield.radius,
          }));
        }
      }
      let keepMe = [];
      for (var system in that.systems) {
        if (that.systems[system].update(elapsedTime)) {
          keepMe.push(that.systems[system]);
        }
      }
      that.systems = keepMe;
    }
	}

	that.render = function(player) {
		for (var system in that.systems) {
			that.systems[system].render(player);
		}
	}

	return that;
})(MyGame.graphics, MyGame.assets);
