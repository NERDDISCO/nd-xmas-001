export class SnowflakeTexture {
  constructor({
    width = 512,
    height = 512,
    maxLevel = 2,
    branches = 2,
    lineWidth = 2,
    angle = 45,
  }) {
    this.maxLevel = maxLevel;
    this.branches = branches;
    this.angle = angle;
    this.lineLength = width / 2.5;
    this.lineWidth = lineWidth;

    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;

    window.canvasCollection.push(this.canvas);

    this.context = this.canvas.getContext("2d", { alpha: true });
    this.context.globalCompositeOperation = "difference";
    this.context.translate(width / 2, height / 2);
  }

  async generate({ sides }) {
    for (let i = 0; i < sides; i++) {
      this.drawLine(0);
      this.context.rotate((Math.PI * 2) / sides);
    }

    return this.canvas;
  }

  drawLine(level) {
    if (level > this.maxLevel) {
      return;
    }

    this.context.strokeStyle = "#fff";
    this.context.lineWidth = this.lineWidth;
    this.context.beginPath();
    this.context.moveTo(0, 0);
    this.context.lineTo(this.lineLength, 0);
    this.context.stroke();

    for (let i = 1; i < this.branches + 1; i++) {
      this.context.save();
      this.context.translate((this.lineLength * i) / (this.branches + 1), 0);
      this.context.scale(0.5, 0.5);
      this.context.save();

      this.context.rotate(this.angle);
      this.drawLine(level + 1);
      this.context.restore();
      this.context.save();

      this.context.rotate(-this.angle);
      this.drawLine(level + 1);
      this.context.restore();

      this.context.restore();
    }
  }
}
