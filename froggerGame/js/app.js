'use strict';

var TILE_HEIGHT = 80,
    TILE_WIDTH = 100;
//make the random variable to let enmey to show at random y position
var random_y = function() {
    var y_arrays = [60,140,220];
    var index = Math.floor((Math.random()) * 3);
    var randomy = y_arrays[index];
    return randomy;
};

//construct Parent Role
var Role = function(x,y,sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
};

//Draw the enemy and player on the screen, required method for game
Role.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Construct children and variables applied to each of our instances go here
// The image/sprite for our enemies, this uses
// a helper we've provided to easily load images
var Enemy = function() {
    this.x = -TILE_WIDTH;
    this.y = random_y();
    this.sprite = 'images/enemy-bug.png';
};

//Replace Enemy.prototype with a new instance of Role
Enemy.prototype = new Role();

   
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for all computers.
    // Enemies our player must avoid
    var speed = TILE_WIDTH;
    this.x = this.x + dt * speed;
    this.checkCollision();
};

Enemy.prototype.checkCollision = function() {
    if ((this.x < player.x + 70) && (this.x > player.x - 70) && (this.y == player.y)){
        player = new Player();
        scores.lose++;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.x = 2*TILE_WIDTH;
    this.y = 3*TILE_WIDTH;
    this.sprite = 'images/char-boy.png';
};

Player.prototype = new Role();

Player.prototype.update = function(dt){
    if (this.y <= 0) {
        
        this.reset();
        scores.win++;
    }
};

Player.prototype.reset = function(){
    this.x = 2*TILE_WIDTH;
    this.y = 3*TILE_WIDTH;
};

Player.prototype.handleInput = function(keys){
    switch(keys) {
    case "up":
        if (this.y >= 60) {
            this.y = this.y - TILE_HEIGHT;
        }
        break;
    case "down":
        if (this.y < 320) {
            this.y = this.y + TILE_HEIGHT;
        }
        break;
    case "left":
        if (this.x > 0) {
            this.x = this.x - TILE_WIDTH;
        }
        break;
    case "right":
        if (this.x < 400) {
            this.x = this.x + TILE_WIDTH;
        }
        break;
    }
};

//Update the Score
var Score = function() {
    this.win = 0;
    this.lose = 0;
    this.score = 0;
    this.name = "James Wang";
};

Score.prototype.render = function() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Name: " + this.name,310,500);
    ctx.fillText("Win: " + this.win,310,525);
    ctx.fillText("Lose: " + this.lose,310,550);
};

var scores = new Score();

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

var genallEnemies = function() {
    var enemy = new Enemy();
    allEnemies.push(enemy);
 };

var updatedallEnemies = function() {
    if (allEnemies.length < 5) {
        genallEnemies();
        // console.log("array lenth" + allEnemies.length);
    }
    for (var index = 0, len = allEnemies.length ; index < len; index++) {
            // console.log(allEnemies[index].x);
            if (allEnemies[index].x > 5*TILE_WIDTH) {
                allEnemies[index].x = allEnemies[index].x - 6*TILE_WIDTH;
                allEnemies[index].y = random_y();
            }
    }
};

setInterval(updatedallEnemies, 10*TILE_WIDTH);
 
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
