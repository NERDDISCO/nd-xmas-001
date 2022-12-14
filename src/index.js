/**
 * @license
 * nd-xmas-001 by NERDDISCO
 * MIT 2022 NERDDISCO
 * https://nerddis.co/nd-xmas-001
 */
import * as THREE from "three";
import { Base } from "./molecules/Base";
import { PRNG } from "./utils/PRNG";
import { Ground } from "./atoms/Ground";
import { Fir1 } from "./atoms/Fir1";
import { Boxes } from "./molecules/Boxes";
import { Snowflake } from "./atoms/Snowflake";
import { PostProcessing } from "./molecules/PostProcessing";
import { pseudoRandomBetween } from "./utils/pseudoeRandomBetween";
const prng = new PRNG();

const rotationSpeed = 2;
const amount = pseudoRandomBetween(prng.next(), 10, 50, true);
const size = 0.3;

const colors = prng.list({ size: amount, unique: true, precision: 4 });
const rotations = prng.list({ size: amount, unique: true, precision: 4 });
const wrappings = prng.list({ size: amount, unique: true });
const wrappingRanges = [{ dots: [0.0, 0.5] }, { stripes: [0.5, 1.0] }];

const base = new Base({
  camera: { x: 0, y: 0, z: 4 },
  prng,
  slug: "nd-xmas-001",
});
const {
  controls,
  clock,
  renderer,
  scene,
  camera,
  textureLoader,
  gltfLoader,
  exrLoader,
  effectComposer,
} = base;

/**
 * Scene
 */
const elements = new THREE.Group();

const gltf = await gltfLoader.loadAsync("models/nd-xmas-001_compressed.glb");
gltf.scene.position.y = -2;

const ground = new Ground();
await ground.generate({ scene, gltf, textureLoader });

const trees = new Fir1();
await trees.generate({ scene, gltf, textureLoader });

elements.add(gltf.scene);

const snowflake = new Snowflake({ prng });
await snowflake.generate({ scene });

const boxes = new Boxes();
const boxGroup = await boxes.generate({
  amount,
  size,
  colors,
  rotations,
  prng,
  wrappings,
  wrappingRanges,
});

elements.add(boxGroup);
// Random rotation for everything
elements.rotation.y = THREE.MathUtils.degToRad(
  pseudoRandomBetween(prng.next(), 0, 360)
);

scene.add(elements);

/**
 * EnvMap
 */
const envMap = await exrLoader.loadAsync(
  "textures/snowy_forest_path_01_1k.exr"
);
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.encoding = THREE.sRGBEncoding;
scene.environment = envMap;

/**
 * Post Processing
 */
const postProcessing = new PostProcessing();
await postProcessing.generate({
  scene,
  camera,
  effectComposer,
});

/**
 * Animate
 */
let previousTime = 0;

const tick = () => {
  controls.update();

  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - previousTime;
  previousTime = elapsedTime;

  elements.rotation.y += THREE.MathUtils.degToRad(delta * rotationSpeed);
  snowflake.update();

  effectComposer.render();

  window.requestAnimationFrame(tick);
};

tick();
