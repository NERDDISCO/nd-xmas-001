import * as THREE from "three";

export class Fir1 {
  constructor() {}

  async generate({ scene, gltf, textureLoader, envMap }) {
    const texture_trunk = await textureLoader.load(
      "textures/Fir1/SnowTrunk/Trunk_snow_DIFFUSE.png"
    );
    texture_trunk.wrapS = texture_trunk.wrapT = THREE.RepeatWrapping;
    const material_trunk = new THREE.MeshStandardMaterial({
      map: texture_trunk,
      envMap,
    });

    const texture_bark = await textureLoader.load(
      "textures/Fir1/bark_DIFFUSE.png"
    );
    texture_bark.wrapS = texture_bark.wrapT = THREE.RepeatWrapping;
    const texture_bark_normal = await textureLoader.load(
      "textures/Fir1/bark_NORMAL.png"
    );
    texture_bark_normal.wrapS = texture_bark_normal.wrapT =
      THREE.RepeatWrapping;

    const material_bark = new THREE.MeshStandardMaterial({
      map: texture_bark,
      normalMap: texture_bark_normal,
      envMap,
    });

    const texture_needless = await textureLoader.load(
      "textures/needles_snow/Needles1K/NeedlessSnow.png"
    );
    const texture_needless_alpha = await textureLoader.load(
      "textures/needles_snow/Needles1K/Needless_Opacity.png"
    );
    const texture_needless_normal = await textureLoader.load(
      "textures/needles_snow/Needles1K/Needless_NORMAL.jpg"
    );
    const material_needless = new THREE.MeshStandardMaterial({
      map: texture_needless,
      alphaMap: texture_needless_alpha,
      normalMap: texture_needless_normal,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true,
      depthTest: true,
      envMap,
    });

    gltf.scene.traverse((child) => {
      if (child.type === "Mesh") {
        if (child.material.name === "Trunk_fir_1") {
          child.material = material_trunk;
        }

        if (child.material.name === "Bark_fir_2.001") {
          child.material = material_bark;
        }

        if (child.material.name.includes("Needless")) {
          child.material = material_needless;
        }
      }
    });
  }
}
