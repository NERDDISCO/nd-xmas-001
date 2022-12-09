import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";

export class Base {
  constructor({ camera, envGradientColorStops, prng }) {
    window.canvasCollection = [];

    this.clock = new THREE.Clock();

    this.textureLoader = new THREE.TextureLoader();

    this.gltfLoader = new GLTFLoader();

    this.exrLoader = new EXRLoader();

    /**
     * Base
     */
    const canvas = document.querySelector("canvas#nd-output");
    this.scene = new THREE.Scene();
    const backgroundColor = new THREE.Color(0xffffff);
    this.scene.background = backgroundColor;
    this.scene.fog = new THREE.Fog(backgroundColor, 10, 15);

    /**
     * Sizes
     */
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    /*
     * Light
     */
    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 0.75);
    this.scene.add(ambientLight);

    /**
     * Camera
     */
    this.camera = new THREE.PerspectiveCamera(
      40,
      this.sizes.width / this.sizes.height,
      0.1,
      500
    );
    this.camera.position.x = camera.x;
    this.camera.position.y = camera.y;
    this.camera.position.z = camera.z;
    this.camera.layers.enable(1);
    this.scene.add(this.camera);

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;

    /**
     * Renderer
     */
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      preserveDrawingBuffer: true,
      antialias: true,
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    /**
     * EffectComposer
     */
    this.effectComposer = new EffectComposer(this.renderer);
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener("resize", () => {
      this.sizes.width = window.innerWidth;
      this.sizes.height = window.innerHeight;

      this.camera.aspect = this.sizes.width / this.sizes.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      this.effectComposer.setSize(this.sizes.width, this.sizes.height);
      this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    this.envMapLoader = new THREE.PMREMGenerator(this.renderer);

    this.clock = new THREE.Clock();

    // Only provide a download function if downloads are enabled
    window._downloadSource = this.renderer.domElement;
    /**
     * Download the piece by pressing s on the keyboard
     */
    document.addEventListener("keydown", (e) => {
      if (e.isComposing || e.code === "KeyS") {
        window.downloadPreview();
        return;
      }
    });

    // Or by using this function via the console
    window.downloadPreview = () => {
      let link = document.createElement("a");
      link.download = fxhash;
      link.href = window._downloadSource.toDataURL();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Detect Safari on iOS as it will not GC the canvas
    // on reload, leading into a memory issue that is not fixed yet
    const userAgent = window.navigator.userAgent;
    const iOS = !!userAgent.match(/iPad/i) || !!userAgent.match(/iPhone/i);
    const webkit = !!userAgent.match(/WebKit/i);
    const isWebkitOnIos = iOS && webkit;

    if (isWebkitOnIos) {
      window.addEventListener(
        "beforeunload",
        (e) => {
          window.canvasCollection.forEach((item) => {
            2;
            item.width = 0;
            item.height = 0;
          });

          console.log("force GC on generated canvases");

          return (e.returnValue = "Are you sure you want to exit?");
        },
        { capture: true }
      );
    }
  }
}
