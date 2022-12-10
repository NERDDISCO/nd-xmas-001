import { MeshStandardMaterial } from "three";
import * as THREE from "three";

export class Ground {
  constructor() {}

  async generate({ scene, gltf, textureLoader }) {
    const texture = await textureLoader.load(
      "textures/snow_ground/snow_02_diff_1k.jpg"
    );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.encoding = THREE.sRGBEncoding;

    const texture_normal = await textureLoader.load(
      "textures/snow_ground/snow_02_nor_gl_1k.jpg"
    );
    texture_normal.wrapS = texture_normal.wrapT = THREE.RepeatWrapping;

    const texture_roughness = await textureLoader.load(
      "textures/snow_ground/snow_02_rough_1k.jpg"
    );
    texture_roughness.encoding = THREE.sRGBEncoding;
    texture_roughness.wrapS = texture_roughness.wrapT = THREE.RepeatWrapping;

    const material = new MeshStandardMaterial({
      map: texture,
      normalMap: texture_normal,
      roughnessMap: texture_roughness,
    });

    gltf.scene.traverse((child) => {
      if (child.name === "Cube") {
        child.material = material;
      }
    });
  }
}
