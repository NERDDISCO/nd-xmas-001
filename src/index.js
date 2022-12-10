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
const prng = new PRNG();

const rotationSpeed = 3;

const amount = 25;
const size = 0.3;

const colors = prng.list({ size: amount, unique: true, precision: 4 });
const rotations = prng.list({ size: amount, unique: true, precision: 4 });
const wrappings = prng.list({ size: amount, unique: true });
const wrappingRanges = [{ dots: [0.0, 0.5] }, { stripes: [0.5, 1.0] }];

const base = new Base({
  camera: { x: 0, y: -1, z: 4 },
  prng,
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
 * EnvMap
 */
const envMap = await exrLoader.loadAsync(
  "textures/snowy_forest_path_01_1k.exr"
);
envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.encoding = THREE.sRGBEncoding;
scene.environment = envMap;

/**
 * Scene
 */
const elements = new THREE.Group();

const gltf = await gltfLoader.loadAsync("models/nd-xmas-001.glb");
gltf.scene.position.y = -2;

const ground = new Ground();
await ground.generate({ scene, gltf, textureLoader });

const trees = new Fir1();
await trees.generate({ scene, gltf, textureLoader, envMap });

elements.add(gltf.scene);

const snowflake = new Snowflake();
await snowflake.generate({ scene, prng });

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
scene.add(elements);

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
