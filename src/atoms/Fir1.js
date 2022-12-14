import * as THREE from "three";

export class Fir1 {
  constructor() {}

  async generate({ gltf, textureLoader }) {
    const texture_bark = await textureLoader.load(
      "textures/Fir1/bark_DIFFUSE_20.jpg"
    );
    texture_bark.encoding = THREE.sRGBEncoding;
    texture_bark.wrapS = texture_bark.wrapT = THREE.RepeatWrapping;

    // const texture_bark_normal = await textureLoader.load(
    //   "textures/Fir1/bark_NORMAL_halfsize.jpg"
    // );
    // texture_bark_normal.encoding = THREE.sRGBEncoding;
    // texture_bark_normal.wrapS = texture_bark_normal.wrapT =
    //   THREE.RepeatWrapping;

    const material_bark = new THREE.MeshStandardMaterial({
      map: texture_bark,
      // normalMap: texture_bark_normal,
    });

    const texture_needless = await textureLoader.load(
      "textures/needles_snow/Needles1K/NeedlessSnow_50.jpg"
    );
    texture_needless.encoding = THREE.sRGBEncoding;

    const texture_needless_alpha = await textureLoader.load(
      "textures/needles_snow/Needles1K/Needless_Opacity.png"
    );
    texture_needless_alpha.encoding = THREE.sRGBEncoding;

    // const texture_needless_normal = await textureLoader.load(
    //   "textures/needles_snow/Needles1K/Needless_NORMAL.jpg"
    // );

    const material_needless = new THREE.MeshStandardMaterial({
      map: texture_needless,
      alphaMap: texture_needless_alpha,
      // normalMap: texture_needless_normal,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: true,
      depthTest: true,
    });

    gltf.scene.traverse((child) => {
      if (child.type === "Mesh") {
        if (child.material.name === "Trunk_fir_1") {
          child.material = material_bark;
        }

        if (child.material?.name === "Bark_fir_2.001") {
          child.material = material_bark;
        }

        if (child.material?.name.includes("Needless")) {
          child.material = material_needless;
        }
      }
    });
  }
}
