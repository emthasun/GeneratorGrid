class App {
  constructor({ canvas, pane }) {
    this.pane = pane;
    this.canvas = canvas;
    this.ctx = canvas.ctx;
    this.width = this.w = canvas.widthInPixels;
    this.height = this.h = canvas.heightInPixels;
    this.setup();
  }

  setup() {
    this.initListeners();

    const imagePaths = Array.from(
      { length: 37 },
      (_, i) => `assets/img${i}.png`
    );
    this.images = [];
    let loadedCount = 0;

    this.backImg = new Image();
    this.backImg.src = "./assetsBack/bild1.jpeg";

    imagePaths.forEach((path, index) => {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (loadedCount === imagePaths.length) {
          this.update();
          console.log("all Images are loaded");
        }
      };
      img.src = path;
      this.images.push(img);
    });
    this.update();
  }

  initListeners() {
    this.canvas.on("startSaving", this.update.bind(this));
    this.canvas.on("saved", this.update.bind(this));
    this.pane.on("change", (ev) => {
      this.update();
    });
  }

  update() {
    // const nbImages = 2;
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.draw();

    const margin = {
      x: this.w / 10,
      y: this.w / 10,
      //   x: 0,
      //   y: 0,
    };

    this.ctx.globalCompositeOperation = "xor";
    const entrelacement = 1.5;

    const sizeColumn = this.w / (PARAMS.subdiv + 1);
    for (let columns = 0; columns < PARAMS.subdiv; columns++) {
      const randomIndex = Math.floor(Math.random() * this.images.length);
      const img = this.images[randomIndex];
      this.ctx.save();
      this.ctx.translate(margin.x, margin.y);

      this.ctx.translate(sizeColumn * columns, 0);

      const wImage = sizeColumn * entrelacement;
      const hImage = (wImage / img.width) * img.height;
      const regulateEntrelacement = wImage / entrelacement;
      this.ctx.translate(-regulateEntrelacement / 2, 0);
      this.ctx.drawImage(img, 0, 0, wImage, hImage);
      this.ctx.restore();

      this.ctx.save();
      //   this.ctx.globalCompositeOperation = "source-in";
    }
    this.ctx.drawImage(
      this.backImg,
      0,
      0,
      this.backImg.width * 4,
      this.backImg.height * 2
    );
    this.ctx.restore();

    // for (
    //   let i = margin.x;
    //   i < this.width - margin.x;
    //   i += this.width / PARAMS.subdiv
    // ) {
    //   for (
    //     let j = margin.y;
    //     j < this.height - margin.y;
    //     j += (this.height - 500) / (PARAMS.subdiv * 2)
    //   ) {
    //     const randomIndex = Math.floor(Math.random() * this.images.length);
    //     const img = this.images[randomIndex];
    //     const imgWidth = this.w / 2;
    //     let newWidth = imgWidth * PARAMS.size;
    //     const imgHeight = (imgWidth / img.width) * img.height;
    //     let newHeight = imgHeight * PARAMS.size;
    //     this.ctx.save();
    //     this.ctx.translate(margin.x, margin.y);
    //     this.ctx.drawImage(
    //       img,
    //       i - newWidth / 2,
    //       j - newHeight / 2,
    //       newWidth,
    //       newHeight
    //     );
    //     this.ctx.restore();
    //   }

    //   this.ctx.save();
    //   //   this.ctx.globalCompositeOperation = "source-in";
    //   this.ctx.drawImage(
    //     this.backImg,
    //     0,
    //     0,
    //     this.backImg.width * 2,
    //     this.backImg.height * 2
    //   );
    //   this.ctx.restore();
    // }

    this.pane.refresh();
  }

  draw() {
    this.ctx.save();
    this.ctx.translate(PARAMS.offset.x, PARAMS.offset.y);
    // Draw other elements on the canvas here
    this.ctx.restore();
  }
}
