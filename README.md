##  HTML5 Canvas 小游戏

####  游戏预览

![QQ截图20190227152610](C:\Users\Administrator\Desktop\前端面试作品\canvas\games\images\QQ截图20190227152610.png)

#### 技术点

+ canvas
+ javascript

####  实现功能

通过canvas创建画布，使用canvas的fillText实现计分板。通过keycode判断用户输入的方向键控制英雄移动，根据英雄和怪兽的坐标判断是否相遇，如果相遇计分板+1，英雄的位置回到画布中心，怪兽给随机位置，开始新一轮游戏。

##### 步骤

1、首先使用canvas创建画布，并设置宽高，最后将其添加到body标签后

```
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
```

2、加载存在images中的图片文件

​      bgReady变量用来标识图片是否已经加载完成，如果在图片加载未完成情况下进行绘制是会报错的

```
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
```

3、监听用户的keydown 和 keyup事件，然后将键值（keycode）先保存下来

```
var keysDown = {};
addEventListener("keydown",function(e){
    keysDown[e.keyCode] = true;
},false);

addEventListener("keyup",function(e){
    delete keysDown[e.keyCode];
},false);
```

4、reset() 函数用于开始新一轮和游戏

​      并且将英雄放回画布的中心

```
var reset = function(){
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
}
```

5、update() 函数负责更新游戏数据，并且通过判断用户的keycode实现英雄的方向移动

​     接下来判断英雄与怪物是否相遇。如果相遇，就是本游戏的胜利点，`monstersCaught +1`然后重新开始新一轮。

```
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
```

准备工作完成

6、利用`canvas`的`drawImage()`先把背景图画出来。然后将英雄和怪物也画出来

​     利用`Canvas`的绘图上下文的样式并调用`fillText`来绘制文字，也就是记分板那一部分

```
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
```

7、主函数

```
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

```

8、调用函数，开始游戏！

```
var then = Date.now();
reset();
main();
```

