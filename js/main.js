function canvas_draw(){
    var canvas = document.getElementById('canvas1');
    if(!canvas || !canvas.getContext){
        console.log('error : can not load canvas');
        return false;
    }
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);   //画面クリア

    var func_ary = create_func_ary(1, -10, 10, 200);
    draw_function(func_ary);

    function draw_function(func_ary){
        var num = func_ary[0].length;   // 点の数
        context.beginPath();
        context.strokeStyle = 'rgb(0, 255, 0)';
        context.moveTo(func_ary[0][0], func_ary[1][0]);     // 1点目を打つ
        for(var i = 1; i < num; i++){
            context.lineTo(func_ary[0][i], func_ary[1][i]); // i点目に向けて線を引く
        }
        context.stroke();
    }

    function draw_blind(crt_x, crt_y){
        return 0;
    }

    function create_func_ary(level, x_min, x_max, num_point){
        var cx_min = canvas.width*0.05;        // キャンバスのx軸の最小値
        var cx_max = canvas.width*0.95;        // キャンバスのx軸の最大値
        var cy_min = canvas.height*0.05;       // キャンバスのy軸の最小値
        var cy_max = canvas.height*0.95;       // キャンバスのy軸の最大値

        /* 関数値の作成 */
        var ary_x = new Array(num_point); // x座標の配列の用意
        var ary_y = new Array(num_point); // y座標の配列の用意

        var delta = (x_max - x_min) / num_point;
        var c_delta = (cx_max - cx_min) / num_point;
        for(var i = 0; i < num_point; i++){
            x = x_min + delta*i;            // x_minからi番目のx座標を求める
            ary_x[i] = cx_min + c_delta*i;  // 描画可能域中でのx座標を求める
            ary_y[i] = x*x;                 // 関数値を計算
        }

        /* 関数値を描画可能域に合わせる */
        var y_min = Math.min.apply(null, ary_y);
        for(var i = 0; i < num_point; i++){
            ary_y[i] -= y_min;                  // 関数値の最小値を一旦，0にする
        }
        var y_max = Math.max.apply(null, ary_y);
        var alpha = (cy_max - cy_min) / y_max;  // 倍率
        for(var i = 0; i < num_point; i++){
            ary_y[i] *= alpha;                  // 関数の値域の幅を描画可能域幅に
            ary_y[i] += cy_min;                 // 関数の最小値をcy_minに直す
        }

        /* 座標系をcanvas座標系に変換 */
        for(var i = 0; i < num_point; i++){
            ary_y[i] = canvas.height - ary_y[i] ;
        }

        return [ary_x, ary_y]; // x,yの値を入れた配列を返却
    }
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