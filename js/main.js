/* グローバル変数 */
var canvas = null;
var context = null;
var num_point = null;
var func_ary = null;
var crt_pos = null;
var blind = false;

function initialize(){
    canvas = document.getElementById('canvas1');
    if(!canvas || !canvas.getContext){
        console.log('error : can not load canvas');
        return false;
    }
    context = canvas.getContext('2d');
    num_point = 100;
    func_ary = create_func_ary(1);
    crt_pos = getRandomInt(0, num_point-1);

    draw_function();
    draw_position();
}

function canvas_draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);   //画面クリア
    draw_function();
    draw_position();
    if (blind == false){
        draw_blind();
    }
}

/*=========================================================================*/

function move_to_left(){
    crt_pos -= Number(document.getElementById('range1').value); // スライダーの値を取り出して左へ移動
    if (crt_pos < 0){
        crt_pos = 0;            // 一番左端を超えていた場合は左端に合わせる
    }
    canvas_draw();              // 再描画
}

function move_to_right(){
    crt_pos += Number(document.getElementById('range1').value); // スライダーの値を取り出して右へ移動
    if (crt_pos > num_point-1){
        crt_pos = num_point-1;  // 一番右端を超えていた場合は右端に合わせる
    }
    canvas_draw();              // 再描画
}

/*=========================================================================*/

function draw_function(){
    context.beginPath();
    context.strokeStyle = 'rgb(0, 255, 0)';
    context.moveTo(func_ary[0][0], func_ary[1][0]);     // 1点目を打つ
    for(var i = 1; i < num_point; i++){
        context.lineTo(func_ary[0][i], func_ary[1][i]); // i点目に向けて線を引く
    }
    context.stroke();
}

function draw_position(){
    context.beginPath();
    context.fillStyle = 'rgb(255, 0, 0)';
    context.arc(func_ary[0][crt_pos], func_ary[1][crt_pos], 2, 0, Math.PI*2, false);
    context.fill();
}

function draw_blind(){
    var slit_size = 7;

    /* 左側のブラインドの矩形 */
    context.beginPath();
    context.fillStyle = 'rgb(10, 10, 10)';
    context.fillRect(0, 0, func_ary[0][crt_pos] - slit_size, canvas.height);

    /* 右側のブラインドの矩形 */
    context.beginPath();
    context.fillStyle = 'rgb(10, 10, 10)';
    var hc = func_ary[0][crt_pos] + slit_size;
    context.fillRect(hc, 0, canvas.width - hc, canvas.height);
}

/*=========================================================================*/

function create_func_ary(level){
    var x_min = -10;
    var x_max = 10;
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

/*=========================================================================*/

function getRandomInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1)) + min;
}