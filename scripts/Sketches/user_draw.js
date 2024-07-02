var sketch = function(p){ 
    //main function for p5
    //take p as argumant representing p5 instant
    let currentColor = 0
    let brushSize = 10
    let myCanvas

    p.setup = function(){
        //runs once sketch satrt
        myCanvas = p.createCanvas(200,200)
        p.background(255)//make bckgrnd transparent


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
    

}