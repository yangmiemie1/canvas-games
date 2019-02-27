var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


//通过创建简单的图片对象来实现加载三张图片
//bgReady变量用来标识图片是否已经加载完成，如果在图片加载未完成情况下进行绘制是会报错的

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
    bgReady = true;
};
bgImage.src = "images/background.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function(){
    heroReady = true;
}
heroImage.src = "images/hero.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function(){
    monsterReady = true;
}
monsterImage.src = "images/monster.png";

//speed属性用来控制他每秒移动多少像素
var hero = {
    speed:256
};
var monster = {};
//用来存储怪物被捉住的次数
var monstersCaught = 0;


//监听用户的输入
//用keysDown这个对象来保存用户按下的键值(keyCode)
var keysDown = {};
addEventListener("keydown",function(e){
    keysDown[e.keyCode] = true;
},false);

addEventListener("keyup",function(e){
    delete keysDown[e.keyCode];
},false);


//reset()函数用于开始新一轮和游戏
//将英雄放回画布中心同时将怪物放到一个随机的地方。
var reset = function(){
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
}

//update函数负责更新游戏的各个对象，会被规律地重复调用。首先它负责检查用户当前按住的是哪一个方向键，然后将英雄往相应方向移动。

var update = function (modifier) {
    if(38 in keysDown){
        hero.y -= hero.speed * modifier;
    }
    if(40 in keysDown){
        hero.y += hero.speed * modifier;
    }
    if(37 in keysDown){
        hero.x -= hero.speed * modifier;
    }
    if(39 in keysDown){
        hero.x += hero.speed * modifier;
    }

    if(
        hero.x <= (monster.x+32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ){
        ++monstersCaught;
        reset();
    }
}

//将所有的东西画出来
var render = function(){
    if(bgReady){
        ctx.drawImage(bgImage,0,0);
    }
    if(heroReady){
        ctx.drawImage(heroImage,hero.x,hero.y);
    }
    if(monsterReady){
        ctx.drawImage(monsterImage,monster.x,monster.y);
    }

    ctx.fillStyle = "rgb(250,250,250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Goblins caught" + monstersCaught,32,32);
}

//游戏的循环结构
var main = function(){
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();

    then = now;

    requestAnimationFrame(main);

    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
}

var then = Date.now();
reset();
main();