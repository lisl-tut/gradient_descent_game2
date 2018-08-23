function canvas_draw(){
    var canvas = document.getElementById('canvas1');
    if(!canvas || !canvas.getContext){
        console.log('error : can not load canvas');
        return false;
    }
    var context = canvas.getContext('2d');

}

function canvas_random_draw(){
    /*====メインここから====*/
    var canvas = document.getElementById('canvas1');
    if(!canvas || !canvas.getContext){
        console.log('error : can not load canvas');
        return false;
    }
    var context = canvas.getContext('2d');

    loop(0, 10000);
    /*====メインここまで====*/
    /*各秒置きにloopContentを実行する関数*/
    function loop(i, endCount){
        if(i <= endCount){
            loopContent(i);
            setTimeout(function(){loop(++i, endCount)}, 2);
        }
    }
    /*各秒置きに行いたい内容をここに書く*/
    function loopContent(i){
        //console.log('counter:' + i)
        //context.clearRect(0, 0, canvas.width, canvas.height);   //画面クリア
        plotDot(getRandomInt(canvas.width*0.1, canvas.width*0.9), getRandomInt(canvas.height*0.1, canvas.height*0.9), getRandomInt(0,4), getRandomInt(0,5));
        function getRandomInt(min, max) {
            return Math.floor(Math.random()*(max - min + 1)) + min;
        }
    }
    /*点を打つ関数*/
    function plotDot(x, y, marker, color){
        var size = 10;
        var min = 0, max = 255; //グラフの最小値, 最大値
        /*数値であるか判定*/
        if(x == null || y == null || isNaN(x) || isNaN(y)) return;
        /*色を指定*/
        if(color == 0) color = 'rgb(0, 255, 255)';
        else if(color == 1) color = 'rgb(255, 0, 255)';
        else if(color == 2) color = 'rgb(255, 255, 0)';
        else if(color == 3) color = 'rgb(0, 255, 0)';
        else if(color == 4) color = 'rgb(0, 0, 255)';
        else if(color == 5) color = 'rgb(255, 0, 0)';
        else{
            console.log('error : color is not ploper in this program plotDot')
        }
        /*マーカーを指定して描画*/
        if(marker == 0) drawCrossDot();
        else if(marker == 1) drawStrokeCircleDot();
        else if(marker == 2) drawFillCircleDot();
        else if(marker == 3) drawStrokeSquareDot();
        else if(marker == 4) drawFillSquareDot();
        else{
            console.log("error : marker is not proper in this program plotDot");
            return;
        }
        function drawCrossDot(){
            context.beginPath();
            context.strokeStyle = color;
            context.moveTo(x-size/2, y-size/2);
            context.lineTo(x+size/2, y+size/2);
            context.stroke();
            context.moveTo(x-size/2, y+size/2);
            context.lineTo(x+size/2, y-size/2);
            context.stroke();
        }
        function drawStrokeCircleDot(){
            context.beginPath();
            context.strokeStyle = color;
            context.arc(x, y, size/2, 0, Math.PI*2, false);
            context.stroke();
        }
        function drawFillCircleDot(){
            context.beginPath();
            context.fillStyle = color;
            context.arc(x, y, size/2, 0, Math.PI*2, false);
            context.fill();
        }
        function drawStrokeSquareDot(){
            context.beginPath();
            context.strokeStyle = color;
            context.strokeRect(x-size/2, y-size/2, size, size);
        }
        function drawFillSquareDot(){
            context.beginPath();
            context.fillStyle = color;
            context.fillRect(x-size/2, y-size/2, size, size);
        }
    }
}