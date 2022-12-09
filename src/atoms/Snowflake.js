import * as THREE from "three";

export class Snowflake {
  constructor() {}

  async generate({ scene, textureLoader }) {
    let positions = [];
    let velocities = [];

    this.amount = 15000;
    this.maxRange = 60;
    this.minRange = this.maxRange / 2;
    this.minHeight = 5;
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < this.amount; i++) {
      positions.push(
        Math.floor(Math.random() * this.maxRange - this.minRange), // x
        Math.floor(Math.random() * this.minRange + this.minHeight), // y
        Math.floor(Math.random() * this.maxRange - this.minRange) // z
      );

      velocities.push(
        Math.floor(Math.random() * 6 - 3) * 0.015, // x -.3 to .3
        Math.floor(Math.random() * 5 + 0.12) * 0.015, // y 0.02 to 0.92
        Math.floor(Math.random() * 6 - 3) * 0.035 // z -.3 to .3
      );
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
      "velocity",
      new THREE.Float32BufferAttribute(velocities, 3)
    );

    const material = new THREE.PointsMaterial({
      size: 0.25,
      map: textureLoader.load("textures/snowflake.png"),
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: true,
      transparent: true,
      opacity: 0.75,
    });

    this.particles = new THREE.Points(geometry, material);
    scene.add(this.particles);
  }

  update() {
    // console.log(this.particles);
    for (let i = 0; i < this.amount * 3; i += 3) {
      this.particles.geometry.attributes.position.array[i] -=
        this.particles.geometry.attributes.velocity.array[i];

      this.particles.geometry.attributes.position.array[i + 1] -=
        this.particles.geometry.attributes.velocity.array[i + 1];

      this.particles.geometry.attributes.position.array[i + 2] -=
        this.particles.geometry.attributes.velocity.array[i + 2];

      // Check if below ground
      if (this.particles.geometry.attributes.position.array[i + 1] < -4) {
        this.particles.geometry.attributes.position.array[i] = Math.floor(
          Math.random() * this.maxRange - this.minRange
        );

        this.particles.geometry.attributes.position.array[i + 1] = Math.floor(
          Math.random() * this.minRange + this.minHeight
        );

        this.particles.geometry.attributes.position.array[i + 2] = Math.floor(
          Math.random() * this.maxRange - this.minRange
        );
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
