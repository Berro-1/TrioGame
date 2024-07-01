// var sketch = function(p) {
//     var characterX = 100;
//     var characterY = 100;
//       p.setup = function() {
//         let cnv = p.createCanvas(200, 200);
//         cnv.style('background', 'rgba(0, 0, 0, 0)');//making backgrnd transperant
//       };
    
//       p.draw = function() {
//         p.clear();
//         p.scale(0.18); // Scale down the entire drawing by 50%
//         p.noStroke();
//         p.rectMode(p.CENTER);
        
//         // Main body
//         p.fill(0);
//         p.rect(200 + characterX, 150 + characterY, 150, 70);
        
//         // Head
//         p.fill(240, 200, 150);
//         p.rect(200 + characterX, 220 + characterY, 130, 110);
        
//         // Eyes
//         p.fill(255);
//         p.rect(170 + characterX, 200 + characterY, 30);
//         p.rect(230 + characterX, 200 + characterY, 30);
//         p.fill(0);
//         p.rect(170 + characterX, 200 + characterY, 10);
//         p.rect(230 + characterX, 200 + characterY, 10);
//         p.fill(255);
//         p.ellipse(200 + characterX, 255 + characterY, 30, 20);
        
//         // Nose
//         p.fill(240, 200, 150);
//         p.rect(200 + characterX, 280 + characterY, 30, 20);
        
//         // Legs
//         p.fill(8, 140, 140);
//         p.rect(200 + characterX, 370 + characterY, 170);
//         p.rect(90 + characterX, 300 + characterY, 30);
//         p.rect(310 + characterX, 300 + characterY, 30);
        
//         // Arms
//         p.fill(240, 200, 150);
//         p.rect(90 + characterX, 360 + characterY, 30, 90);
//         p.rect(310 + characterX, 360 + characterY, 30, 90);
    
//       };
//     };
var sketch = function(p) {
    let penDown = false;
    let penColor = 0; // Default color black
    let penThickness = 2; // Default thickness
    let my_canvas;
    
    p.setup = function() {
      my_canvas = p.createCanvas(p.windowWidth, p.windowHeight);
      p.background(255);
      
      // Create color buttons
      document.getElementById('black').addEventListener('click', () => penColor = 0);
      document.getElementById('red').addEventListener('click', () => penColor = p.color(255, 0, 0));
      document.getElementById('green').addEventListener('click', () => penColor = p.color(0, 255, 0));
      document.getElementById('blue').addEventListener('click', () => penColor = p.color(0, 0, 255));
      
      // Create thickness buttons
      document.getElementById('thin').addEventListener('click', () => penThickness = 2);
      document.getElementById('medium').addEventListener('click', () => penThickness = 5);
      document.getElementById('thick').addEventListener('click', () => penThickness = 10);
      document.getElementById('eraser').addEventListener('click', () => {
        penColor = 255;
        penThickness = 20;
      });
      document.getElementById('char').addEventListener('click', () => {
        saveCharInStorage();
      });
    };
    
    p.draw = function() {
      if (penDown) {
        p.stroke(penColor);
        p.strokeWeight(penThickness);
        p.line(p.pmouseX, p.pmouseY, p.mouseX, p.mouseY);
      }
    };
    
    p.mousePressed = function() {
      penDown = true;
    };
    
    p.mouseReleased = function() {
      penDown = false;
    };
    
    function saveCharInStorage() {
      let char = my_canvas.canvas.toDataURL('image/png');
      localStorage.setItem('player', char);
      alert('Character is saved');
    }};
  
    new p5(sketch);