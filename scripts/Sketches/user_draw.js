var sketch = function(p){ 
    //main function for p5
    //take p as argumant representing p5 instant
    let currentColor = 0
    let brushSize = 10
    let myCanvas

    p.setup = function(){
        //runs once sketch satrt
        myCanvas = p.createCanvas(200,200)
        p.clear()//make bckgrnd transparent

        document.getElementById('black').addEventListener('click', () => p.setColor('#000000'));
        document.getElementById('red').addEventListener('click', () => p.setColor('#ff0000'));
        document.getElementById('green').addEventListener('click', () => p.setColor('#00ff00'));
        document.getElementById('blue').addEventListener('click', () => p.setColor('#0000ff'));
    
        document.getElementById('thin').addEventListener('click', () => p.brushSize(5));
        document.getElementById('medium').addEventListener('click', () => p.brushSize(10));
        document.getElementById('thick').addEventListener('click', () => p.brushSize(20));
    
        document.getElementById('eraser').addEventListener('click', p.eraser);
    
        document.getElementById('clear').addEventListener('click', p.clearCanvas);
    
        document.getElementById('save').addEventListener('click', p.saveDrawing);
    }
    p.draw = function(){
        if(p.mousseIsPressed){
            if(p.mousseX >=0 && p.mousseX <= 200 && p.mousseY >= 0 && p.mousseY <= 200){//draw in th canvas
                p.fill(currentColor)//color = current color
                p.noStroke()
                p.rect(p.mousseX, p.mousseY, brushSize,brushSize)//draw rect form x,y with size of brushsize
            }

        }
        
    }
    p.setColor = function(color){
        currentColor = color
    }
    p.brushSize = function(size){
        brushSize =size
    }
    p.erase = function(){
        currentColor = '255'
    }
    p.clearCanvas = function(){
        p.background('255')
    }
    p.saveDrawing = function(){
        let image = myCanvas.canvas.toDataURL('image/png');
        localStorage.setItem('savedChar', image)
    }

}