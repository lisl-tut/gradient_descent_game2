/* グローバル変数 */
var canvas = null;
var context = null;
var num_point = null;
var crt_pos = null;
var move_count = null;
var blind = null;
var func_ary = null;

function initialize(){
    /* HTMLコンテンツの初期化 */
    // クラスネームやコンテンツの中身，スタイルを変更する
    document.getElementById("start").className="waves-effect waves-light btn";
    document.getElementById("left").className="waves-effect waves-light btn disabled";
    document.getElementById("right").className="waves-effect waves-light btn disabled";
    document.getElementById("submit").className="waves-effect waves-light btn disabled";
    document.getElementById("move_count").innerHTML = 0;
    document.getElementById("answer").style.display="none";

    /* グローバル変数の初期化 */
    canvas = document.getElementById('canvas1');
    if(!canvas || !canvas.getContext){
        console.log('error : can not load canvas');
        return false;
    }
    context = canvas.getContext('2d');                      // コンテキストの取得
    context.clearRect(0, 0, canvas.width, canvas.height);   // 画面クリア

    num_point = 100;                        // 関数のサンプル点の数
    func_ary = create_func_ary(1);          // 関数値の配列
    crt_pos = getRandomInt(0, num_point-1); // ユーザーの現在地
    move_count = 0;                         // 動いた回数
    blind = true;                           // ブラインドをかけるか
}

/*=========================================================================*/

function start_game(){
    initialize();   // 初期化
    // 難易度設定
    if (document.getElementById('demo_switch').checked) blind = false; // DemoのときはブラインドOFF
    canvas_draw();  // キャンバスの描画

    /* ボタンの有効・無効の設定 */
    document.getElementById("start").className="waves-effect waves-light btn disabled";
    document.getElementById("left").className="waves-effect waves-light btn";
    document.getElementById("right").className="waves-effect waves-light btn";
    document.getElementById("submit").className="waves-effect waves-light btn";
}

function move_to_left(){
    if (crt_pos == 0) return;
    crt_pos -= Number(document.getElementById('step_range').value); // スライダーの値を取り出して左へ移動
    if (crt_pos < 0){
        crt_pos = 0;            // 一番左端を超えていた場合は左端に合わせる
    }
    move_count++;               // 移動回数をインクリメント
    document.getElementById('move_count').innerHTML = move_count; // 移動回数の表示を更新
    canvas_draw();              // 再描画
}

function move_to_right(){
    if (crt_pos == num_point-1) return;
    crt_pos += Number(document.getElementById('step_range').value); // スライダーの値を取り出して右へ移動
    if (crt_pos > num_point-1){
        crt_pos = num_point-1;  // 一番右端を超えていた場合は右端に合わせる
    }
    move_count++;               // 移動回数をインクリメント
    document.getElementById('move_count').innerHTML = move_count; // 移動回数の表示を更新
    canvas_draw();              // 再描画
}

function submit_answer(){
    /* ボタンの有効・無効の設定 */
    document.getElementById("left").className="waves-effect waves-light btn disabled";
    document.getElementById("right").className="waves-effect waves-light btn disabled";
    document.getElementById("submit").className="waves-effect waves-light btn disabled";

    /* 答えの表示 */
    blind = false;  // ブラインドを外す
    canvas_draw();  // 関数をブラインドなしで描画
    document.getElementById("answer").style.display="block";  // 結果のボックスを表示
}

function next_game(){
    initialize();   // 初期化
}

/*=========================================================================*/

function canvas_draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);   //画面クリア
    draw_function();    // 関数の描画
    draw_position();    // 現在地の描画
    if (blind == true){
        draw_blind();   // ブラインドの描画
    }
}

function draw_function(){
    context.beginPath();
    context.strokeStyle = 'rgb(255, 0, 255)';
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