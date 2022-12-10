import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SepiaShader } from "three/examples/jsm/shaders/SepiaShader.js";

export class PostProcessing {
  constructor() {}

  async generate({ scene, camera, effectComposer }) {
    const renderPass = new RenderPass(scene, camera);
    effectComposer.addPass(renderPass);

    // const brightnessContrast = new ShaderPass(BrightnessContrastShader);
    // brightnessContrast.uniforms.brightness.value = -0.2;
    // brightnessContrast.uniforms.contrast = -1.0;
    // effectComposer.addPass(brightnessContrast);

    // const bloom = new UnrealBloomPass();
    // bloom.threshold = 0.21;
    // bloom.strength = 1.2;
    // bloom.radius = 0.55;
    // effectComposer.addPass(bloom);
    // const gammaCorrection = new ShaderPass(GammaCorrectionShader);

    // const composer = new EffectComposer( renderer, new THREE.WebGLRenderTarget( rtWidth, rtHeight, rtParameters ) );
    // composer.addPass( gammaCorrection );
  }
}
