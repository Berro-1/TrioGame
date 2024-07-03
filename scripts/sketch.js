let canvas;
let drawing = [];
let currentPath = [];
let isDrawing = false;
let currentPlayer = 1;
let currentColor = 'black';  // Initial color set to black
let offscreenBuffer;

function setup() {
  canvas = createCanvas(90, 110);
  canvas.parent("canvasContainer1");
  clearCanvas();
  strokeWeight(4);

  // Create an off-screen buffer for saving drawings
  offscreenBuffer = createGraphics(90, 120);
  offscreenBuffer.clear();
  offscreenBuffer.strokeWeight(4);

  // Adding event listeners
  document.getElementById("nextButton1").addEventListener("click", nextPlayer);
  document.getElementById("nextButton2").addEventListener("click", saveDrawings);
  document.getElementById("clearButton1").addEventListener("click", clearCanvas);
  document.getElementById("clearButton2").addEventListener("click", clearCanvas);
}

function draw() {
  noFill();
  stroke(currentColor);
  strokeWeight(4);
  if (isDrawing) {
    const point = {
      x: mouseX,
      y: mouseY
    };
    currentPath.push(point);
  }

  drawing.forEach(path => {
    beginShape();
    path.forEach(point => {
      vertex(point.x, point.y);
    });
    endShape();
  });
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
  }
}

function mouseReleased() {
  isDrawing = false;
}

function nextPlayer() {
  console.log("Next player function called.");
  if (currentPlayer === 1) {
    saveCanvasToLocalStorage("character1");
    document.getElementById("canvasWrapper1").style.display = 'none';
    document.getElementById("canvasWrapper2").style.display = 'flex';
    canvas.remove();
    canvas = createCanvas(90, 120);
    canvas.parent("canvasContainer2");
    clearCanvas();
    currentPlayer = 2;
    console.log("Transitioned to player 2.");
  }
}

function saveDrawings() {
  console.log("Save drawings function called.");
  saveCanvasToLocalStorage("character2");
  console.log("Proceeding to game");
  document.getElementById('nextButton2').click();
}

function clearCanvas() {
  isDrawing = false;
  drawing = [];
  currentPath = [];
  clear();  // Clear the canvas without adding a background color
}
function saveCanvasToLocalStorage(key) {
    console.log(drawing);
    if (
      drawing.length === 0 ||
      (drawing.length === 1 && drawing[0].length === 0)
    ) {
      console.log(`Saving empty character to localStorage with key: ${key}`);
      localStorage.setItem(key, "");
    } else {
      loadPixels();
      let img = canvas.canvas.toDataURL("image/png");
      const emptyImageData =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAC0CAYAAABi3Il7AAAAAXNSR0IArs4c6QAAAm5JREFUeF7t00ERAAAIhECvf2lr7AMTMODtOsrAKJpgriDYExSkIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtpCCYAQynhRQEM4DhtJCCYAYwnBZSEMwAhtNCCoIZwHBaSEEwAxhOCykIZgDDaSEFwQxgOC2kIJgBDKeFFAQzgOG0kIJgBjCcFlIQzACG00IKghnAcFpIQTADGE4LKQhmAMNpIQXBDGA4LaQgmAEMp4UUBDOA4bSQgmAGMJwWUhDMAIbTQgqCGcBwWkhBMAMYTgspCGYAw2khBcEMYDgtBAvyzJIAtc5rLskAAAAASUVORK5CYII=";
  
      if (img === emptyImageData) {
        localStorage.setItem(key, "");
        console.log(`Character saved to localStorage with key: ${key}`);
        return;
      } else {
        console.log(`Saving character to localStorage with key: ${key}`);
        localStorage.setItem(key, img);
      }
    }
    console.log(`Current localStorage for ${key}: `, localStorage.getItem(key));
  }
function changeColor(color) {
  currentColor = color;
}

function undo() {
  if (drawing.length > 0) {
    drawing.pop();
  }
}
