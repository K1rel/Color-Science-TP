interface RGB {
  r: number;
  g: number;
  b: number;
}

interface YCbCr {
  y: number;
  cb: number;
  cr: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

class ColorSpaceConverter {
  private originalCanvas: HTMLCanvasElement;
  private ycbcrCanvas: HTMLCanvasElement;
  private hsvCanvas: HTMLCanvasElement;
  private imageInput: HTMLInputElement;

  constructor() {
    this.originalCanvas = document.getElementById(
      "originalCanvas"
    ) as HTMLCanvasElement;
    this.ycbcrCanvas = document.getElementById(
      "ycbcrCanvas"
    ) as HTMLCanvasElement;
    this.hsvCanvas = document.getElementById("hsvCanvas") as HTMLCanvasElement;
    this.imageInput = document.getElementById("imageInput") as HTMLInputElement;

    this.imageInput.addEventListener(
      "change",
      this.handleImageUpload.bind(this)
    );
  }

  private async handleImageUpload(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      [this.originalCanvas, this.ycbcrCanvas, this.hsvCanvas].forEach(
        (canvas) => {
          canvas.width = width;
          canvas.height = height;
        }
      );

      const originalCtx = this.originalCanvas.getContext("2d")!;
      originalCtx.drawImage(img, 0, 0);

      const imageData = originalCtx.getImageData(0, 0, width, height);

      this.processYCbCr(imageData);

      this.processHSV(imageData);
    };
  }

  private rgbToYCbCr(rgb: RGB): YCbCr {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = -0.169 * r - 0.3313 * g + 0.5 * b + 0.5;
    const cr = 0.5 * r - 0.4187 * g - 0.0813 * b + 0.5;

    return { y, cb, cr };
  }

  private rgbToHSV(rgb: RGB): HSV {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;

    let h = 0;
    if (diff === 0) {
      h = 0;
    } else if (max === r) {
      h = 60 * (((g - b) / diff) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / diff + 2);
    } else {
      h = 60 * ((r - g) / diff + 4);
    }

    if (h < 0) h += 360;

    const s = max === 0 ? 0 : diff / max;
    const v = max;

    return { h, s, v };
  }

  private processYCbCr(imageData: ImageData): void {
    const ctx = this.ycbcrCanvas.getContext("2d")!;
    const newImageData = ctx.createImageData(imageData.width, imageData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const rgb: RGB = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };

      const ycbcr = this.rgbToYCbCr(rgb);

      newImageData.data[i] = ycbcr.cr * 255;
      newImageData.data[i + 1] = ycbcr.y * 255;
      newImageData.data[i + 2] = ycbcr.cb * 255;
      newImageData.data[i + 3] = imageData.data[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
  }

  private processHSV(imageData: ImageData): void {
    const ctx = this.hsvCanvas.getContext("2d")!;
    const newImageData = ctx.createImageData(imageData.width, imageData.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const rgb: RGB = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
      };

      const hsv = this.rgbToHSV(rgb);

      newImageData.data[i] = (hsv.h / 360) * 255;
      newImageData.data[i + 1] = hsv.s * 255;
      newImageData.data[i + 2] = hsv.v * 255;
      newImageData.data[i + 3] = imageData.data[i + 3];
    }

    ctx.putImageData(newImageData, 0, 0);
  }
}

new ColorSpaceConverter();
