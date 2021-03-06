//------------------------------------------------------------------
//
// Manages all the barriers in the map.
//
//------------------------------------------------------------------

const random = require('./random');

// spec : {
// weaponUpgrades : numWeaponUpgrades,
// bullets : numBulletUpgrades,
// health : numHealthUpgrades,
// armour : numArmourUpgrades

function createPowerups(spec) {
  let that = {};
  let currentPowerupId = 0;
  let powerups = {};
  let recentlyRemoved = [];

  Object.defineProperty(that, 'recentlyRemoved', {
    get: () => recentlyRemoved,
    set: value => {
      recentlyRemoved = value;
    },
  });

  for (let i = 0; i < spec.weaponUpgrades; ++i) {
    powerups[currentPowerupId++] = {
      type: 'weapon',
      position: {
        x: random.nextDouble() * 15,
        y: random.nextDouble() * 15,
      },
      radius: 0.03,
    };
  }
  for (let i = 0; i < spec.bullets; ++i) {
    powerups[currentPowerupId++] = {
      type: 'bullet',
      position: {
        x: random.nextDouble() * 15,
        y: random.nextDouble() * 15,
      },
      radius: 0.04,
    };
  }

  for (let i = 0; i < spec.health; ++i) {
    powerups[currentPowerupId++] = {
      type: 'health',
      position: {
        x: random.nextDouble() * 15,
        y: random.nextDouble() * 15,
      },
      radius: 0.02,
    };
  }

  for (let i = 0; i < spec.health; ++i) {
    powerups[currentPowerupId++] = {
      type: 'armour',
      position: {
        x: random.nextDouble() * 15,
        y: random.nextDouble() * 15,
      },
      radius: 0.02,
    };
  }

  function collided(powerup, location, radius) {
    const distance = Math.sqrt(
      Math.pow(powerup.position.x - location.x, 2) +
        Math.pow(powerup.position.y - location.y, 2)
    );

    const radii = powerup.radius + radius;

    return distance <= radius;
  }

  that.getSurroundingPowerups = function(location, radius) {
    let powerupsInRegion = {};
    for (let powerup in powerups) {
      if (collided(powerups[powerup], location, radius)) {
        powerupsInRegion[powerup] = powerups[powerup];
      }
    }
    return powerupsInRegion;
  };

  that.toJSON = function() {
    return {
      powerups
    };
  }

  that.removePowerup = function(id) {
    delete powerups[id]
    recentlyRemoved.push(id);
  };

  return that;
}

module.exports.create = createPowerups;
