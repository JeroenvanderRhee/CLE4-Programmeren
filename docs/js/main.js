"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameObject = (function () {
    function GameObject() {
    }
    GameObject.prototype.update = function () {
        this.div.style.transform = "translate(" + this.x + "px, " + this.y + "px)";
    };
    GameObject.prototype.getRectangle = function () {
        return this.div.getBoundingClientRect();
    };
    return GameObject;
}());
var Astroid = (function (_super) {
    __extends(Astroid, _super);
    function Astroid(g) {
        var _this = _super.call(this) || this;
        _this.game = g;
        _this.div = document.createElement("astroid");
        document.body.appendChild(_this.div);
        _this.x = Math.random() * window.innerWidth;
        _this.y = -100;
        _this.speedX = (Math.random() * 0.5);
        _this.speedY = 1 + (Math.random() * 4);
        return _this;
    }
    Astroid.prototype.removeAstroid = function () {
        this.div.remove();
        this.game.currentscreen.removeFromArray();
    };
    Astroid.prototype.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        _super.prototype.update.call(this);
    };
    return Astroid;
}(GameObject));
var Spaceship = (function (_super) {
    __extends(Spaceship, _super);
    function Spaceship(up, down, left, right, space) {
        var _this = _super.call(this) || this;
        _this.downSpeed = 0;
        _this.upSpeed = 0;
        _this.leftSpeed = 0;
        _this.rightSpeed = 0;
        _this.fired = false;
        _this.div = document.createElement("spaceship");
        document.body.appendChild(_this.div);
        _this.upkey = up;
        _this.downkey = down;
        _this.leftkey = left;
        _this.rightkey = right;
        _this.spacekey = space;
        _this.x = (window.innerWidth / 2);
        _this.y = (window.innerHeight / 2);
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
        return _this;
    }
    Spaceship.prototype.onKeyDown = function (e) {
        switch (e.keyCode) {
            case this.upkey:
                this.upSpeed = 5;
                break;
            case this.downkey:
                this.downSpeed = 5;
                break;
            case this.leftkey:
                this.leftSpeed = 5;
                break;
            case this.rightkey:
                this.rightSpeed = 5;
                break;
            case this.spacekey:
                break;
        }
    };
    Spaceship.prototype.onKeyUp = function (e) {
        switch (e.keyCode) {
            case this.upkey:
                this.upSpeed = 0;
                break;
            case this.downkey:
                this.downSpeed = 0;
                break;
            case this.leftkey:
                this.leftSpeed = 0;
                break;
            case this.rightkey:
                this.rightSpeed = 0;
                break;
        }
    };
    Spaceship.prototype.update = function () {
        var newY = this.y - this.upSpeed + this.downSpeed;
        var newX = this.x - this.leftSpeed + this.rightSpeed;
        if (newY > 0 && newY + 100 < window.innerHeight) {
            this.y = newY;
        }
        if (newX > 0 && newX + 100 < window.innerWidth)
            this.x = newX;
        _super.prototype.update.call(this);
    };
    Spaceship.prototype.firePhasers = function () {
        if (this.fired == false) {
            phaserFire.play();
            this.phaserbeam = new Phaserbeam(this.x, this.y);
            console.log("firing");
        }
        this.phaserbeam.update();
    };
    return Spaceship;
}(GameObject));
var Phaserbeam = (function (_super) {
    __extends(Phaserbeam, _super);
    function Phaserbeam(x, y) {
        var _this = _super.call(this) || this;
        _this.div = document.createElement("phaserbeam");
        document.body.appendChild(_this.div);
        _this.x = x;
        _this.y = y;
        return _this;
    }
    Phaserbeam.prototype.removePhaserbeam = function () {
        this.div.remove();
    };
    Phaserbeam.prototype.update = function () {
        this.y - 5;
        if (this.getRectangle().top < -315) {
            this.removePhaserbeam();
        }
        _super.prototype.update.call(this);
    };
    return Phaserbeam;
}(GameObject));
var PlayScreen = (function () {
    function PlayScreen(g) {
        this.astroids = [];
        this.gamefix = 0;
        this.game = g;
        this.spaceship = new Spaceship(87, 83, 65, 68, 32);
        for (var i = 0; i < 10; i++) {
            this.astroids.push(new Astroid(this.game));
        }
    }
    PlayScreen.prototype.update = function () {
        for (var _i = 0, _a = this.astroids; _i < _a.length; _i++) {
            var a = _a[_i];
            if (this.checkCollision(a.getRectangle(), this.spaceship.getRectangle())) {
                if (this.gamefix <= 10) {
                    this.gamefix++;
                }
                else {
                    allShesGot.play();
                    this.game.showGameoverScreen();
                }
            }
            if (this.spaceship.fired == true) {
                if (this.checkCollision(a.getRectangle(), this.spaceship.phaserbeam.getRectangle())) {
                    explosion.play();
                    a.removeAstroid();
                }
            }
            if (a.getRectangle().left < 0 ||
                a.getRectangle().right > window.innerWidth ||
                a.getRectangle().bottom > window.innerHeight) {
                a.removeAstroid();
                this.astroids.push(new Astroid(this.game));
            }
            a.update();
        }
        this.spaceship.update();
    };
    PlayScreen.prototype.checkCollision = function (a, b) {
        return (a.left <= b.right &&
            b.left <= a.right &&
            a.top <= b.bottom &&
            b.top <= a.bottom);
    };
    PlayScreen.prototype.removeFromArray = function (removeMe) {
        for (var i = 0; i < this.astroids.length; i++) {
            if (this.astroids[i] === removeMe) {
                this.astroids.splice(i, 1);
            }
        }
    };
    return PlayScreen;
}());
var Game = (function () {
    function Game() {
        this.currentscreen = new StartScreen(this);
        this.gameLoop();
        music.play();
    }
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.currentscreen.update();
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.showPlayScreen = function () {
        document.body.innerHTML = "";
        this.currentscreen = new PlayScreen(this);
    };
    Game.prototype.showGameoverScreen = function () {
        document.body.innerHTML = "";
        this.currentscreen = new GameOver(this);
    };
    return Game;
}());
window.addEventListener("load", function () { return new Game(); });
var GameOver = (function () {
    function GameOver(g) {
        var _this = this;
        this.game = g;
        this.div = document.createElement("splash");
        document.body.appendChild(this.div);
        this.div.addEventListener("click", function () { return _this.splashClicked(); });
        this.div.innerHTML = "I'm giving her all she's got, captain!";
    }
    GameOver.prototype.update = function () {
    };
    GameOver.prototype.splashClicked = function () {
        this.game.showPlayScreen();
    };
    return GameOver;
}());
var StartScreen = (function () {
    function StartScreen(g) {
        var _this = this;
        this.game = g;
        this.div = document.createElement("splash");
        document.body.appendChild(this.div);
        this.div.addEventListener("click", function () { return _this.splashClicked(); });
        this.div.innerHTML = "ENGAGE";
    }
    StartScreen.prototype.update = function () {
    };
    StartScreen.prototype.splashClicked = function () {
        engage.play();
        this.game.showPlayScreen();
    };
    return StartScreen;
}());
//# sourceMappingURL=main.js.map