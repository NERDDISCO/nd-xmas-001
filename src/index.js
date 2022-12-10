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
import { pseudoRandomBetween } from "./utils/pseudoeRandomBetween";
import { PostProcessing } from "./molecules/PostProcessing";
const prng = new PRNG();

const rotationSpeed = 3;

const amount = 25;
const size = 0.3;
const spaceX = 5;
const spaceY = 0;
const spaceZ = 5;
const rotationX = pseudoRandomBetween(prng.next(), -24, 24);
const rotationY = pseudoRandomBetween(prng.next(), -24, 24);
const rotationZ = pseudoRandomBetween(prng.next(), -24, 24);

const colors = prng.list({ size: amount, unique: true, precision: 4 });
const positions = prng.list({ size: amount, unique: true, precision: 4 });
const rotations = prng.list({ size: amount, unique: true, precision: 4 });
const wireframes = prng.list({ size: amount, unique: true, precision: 4 });
const wrappings = prng.list({ size: amount, unique: true });
const wireframeThreshold = prng.next();
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
  textureEquirec,
  envMapLoader,
  textureLoader,
  gltfLoader,
  exrLoader,
  sizes,
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

const ground = new Ground();
await ground.generate({ scene, gltf, textureLoader });

const trees = new Fir1();
await trees.generate({ scene, gltf, textureLoader, envMap });

gltf.scene.position.y = -2;
elements.add(gltf.scene);

const snowflake = new Snowflake();
await snowflake.generate({ scene, textureLoader, envMap });

const boxes = new Boxes();
const boxGroup = await boxes.generate({
  amount,
  scene,
  size,
  spaceX,
  spaceY,
  spaceZ,
  rotationX,
  rotationY,
  rotationZ,
  colors,
  positions,
  rotations,
  prng,
  textureEquirec,
  envMapLoader,
  wireframes,
  wireframeThreshold,
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

  // renderer.autoClear = false;
  // renderer.clear();

  // camera.layers.set(1);
  // effectComposer.render();

  // renderer.clearDepth();
  // camera.layers.set(0);
  // renderer.render(scene, camera);
  effectComposer.render();

  window.requestAnimationFrame(tick);
};

// Start the animation
tick();
