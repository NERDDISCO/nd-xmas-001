import * as THREE from "three";
import { inRange } from "../utils/inRange";
import { pseudoRandomBetween } from "../utils/pseudoeRandomBetween";
import { FlakesPseudoRandomTexture } from "../textures/FlakesPseudoRandomTexture";

export class Boxes {
  constructor() {}

  async generate({
    rotationX,
    rotationY,
    rotationZ,
    amount,
    scene,
    size,
    spaceX,
    spaceY,
    spaceZ,
    colors,
    positions,
    rotations,
    prng,
    wrappings,
    wrappingRanges,
  }) {
    this.boxGroup = new THREE.Group();

    const minRange = 5;
    const maxRange = 10;

    const geometry = new THREE.BoxGeometry(size, size, size);

    const material = new THREE.MeshPhysicalMaterial({
      clearcoat: 0.65,
      metalness: 0.9,
      roughness: 0.2,
      color: 0xffffff,
      normalScale: new THREE.Vector2(0.4, 0.4),
      transparent: false,
      depthTest: true,
      depthWrite: true,
      side: THREE.FrontSide,
    });

    const box = new THREE.Mesh(geometry, material);
    // box.layers.set(1);

    for (let i = 0; i < amount; i++) {
      const sign = i % 2 == 0 ? -1 : 1;

      const _box = box.clone();
      _box.material = box.material.clone();

      // Texture
      const wrapping = inRange({
        currentValue: wrappings[i],
        ranges: wrappingRanges,
      });

      switch (wrapping) {
        case "dots": {
          const _size = pseudoRandomBetween(prng.next(), 48, 176, true);
          _box.material.normalMap = new THREE.CanvasTexture(
            new FlakesPseudoRandomTexture({
              width: _size,
              height: _size,
              pseudoRandom: prng.next,
            }),
            THREE.ACESFilmicToneMapping,
            THREE.RepeatWrapping,
            THREE.RepeatWrapping
          );
          break;
        }
        case "stripes": {
          _box.material.normalMap = new THREE.CanvasTexture(
            new FlakesPseudoRandomTexture({
              width: pseudoRandomBetween(prng.next(), 4, 24, true),
              height: pseudoRandomBetween(prng.next(), 176, 256, true),
              pseudoRandom: prng.next,
            }),
            THREE.ACESFilmicToneMapping,
            THREE.RepeatWrapping,
            THREE.RepeatWrapping
          );
          break;
        }
      }

      // Color
      _box.material.color = new THREE.Color(
        `hsl(${360 * colors[i]}, 70%, 50%)`
      );

      // Position
      _box.position.set(
        Math.floor(prng.next() * maxRange - minRange),
        -1.15,
        Math.floor(prng.next() * maxRange - minRange)
      );

      // Rotation
      _box.rotation.set(
        THREE.MathUtils.degToRad(rotations[i] * 360),
        THREE.MathUtils.degToRad(i),
        0
      );

      // Scale
      const _scale = pseudoRandomBetween(prng.next(), 0.25, 1.25);

      _box.scale.x = _scale;
      _box.scale.y = _scale;
      _box.scale.z = _scale;

      this.boxGroup.add(_box);
    }

    // this.boxGroup.layers.set(1);

    return this.boxGroup;
  }

  update({ scene, rotationSpeed }) {
    this.boxGroup.rotation.y += rotationSpeed;
    this.fxHashBox.update({});
  }
}
