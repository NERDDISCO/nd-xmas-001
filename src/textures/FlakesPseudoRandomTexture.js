/**
 * Extended from three/examples/jsm/textures/FlakesTexture to provide
 * a pseudo random version instead of Math.random to use it in generative art
 *
 * MIT 2022 NERDDISCO
 */
export class FlakesPseudoRandomTexture {
  constructor({ width = 512, height = 512, pseudoRandom }) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    window.canvasCollection.push(canvas);

    const context = canvas.getContext("2d", { alpha: false });
    context.fillStyle = "rgb(127,127,255)";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < 1000; i++) {
      const x = pseudoRandom() * width;
      const y = pseudoRandom() * height;
      const r = pseudoRandom() * 3 + 3;

      let nx = pseudoRandom() * 2 - 1;
      let ny = pseudoRandom() * 2 - 1;
      let nz = 1.5;

      const l = Math.sqrt(nx * nx + ny * ny + nz * nz);

      nx /= l;
      ny /= l;
      nz /= l;

      context.fillStyle =
        "rgb(" +
        (nx * 127 + 127) +
        "," +
        (ny * 127 + 127) +
        "," +
        nz * 255 +
        ")";
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
    }

    return canvas;
  }
}
