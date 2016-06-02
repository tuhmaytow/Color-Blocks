"use strict"
var Game = function(myCanvas, context) {
  this.canvas = document.getElementById("myCanvas");
  this.context = this.canvas.getContext("2d");
  this.entities = [];
  this.viruses = [];
  this.currentPiece = null;
  this.points = 0;
  this.unmatched = [];
  this.paused = false;
  this.time = null;
  this.over = false;
  this.colorOption = ["#D0FA58", "#81DAF5", "#FF0040", "#FFBF00"];
  this.virusColors = ["#D0FA58", "#81DAF5", "#FF0040", "#FFBF00"];
};

Game.prototype.addEntity = function (entity) {
  this.entities.push(entity);
};

Game.prototype.render = function () {
  //erase the page
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  this.context.fillStyle = "#4B5267";
  this.context.fillRect(0,0,900,900);
  for (var i = 0; i < this.entities.length; i++) {
  	this.entities[i].draw(this.context);
  }
  for(var j = 0; j < this.viruses.length; j++){
    this.viruses[j].draw(this.context);
  }
};

Game.prototype.addNewSquare = function () {
  this.currentPiece = new Square(150, 0, this.colorOption[Math.floor(Math.random()*4)]); //"150" to have the currentPiece fall from the middle
  this.addEntity(this.currentPiece);
};

Game.prototype.addNewVirus = function () {
  if(this.viruses.length < 8) {
    var self = this;
      for(var i = 0; i < 4; i++){       //produces 4 new virus
          var coords = self.virusCoordinates();
          var currentVirus = new Virus(coords[0], coords[1], self.virusColors[Math.floor(Math.random()*4)]);
          self.viruses.push(currentVirus);
      }
  }
};

Game.prototype.goingDown = function () {
    if(this.paused){
      clearInterval(this.time);
    } else { //when its not paused
      this.time = setInterval(this.move.bind(this, "down"), 800) //gravity of the square going down
    }
};

Game.prototype.validateMove = function (x, y, direction) {
  if (x < 0 || x > this.canvas.width - 25) { //if x is less than 0, or if x is less than the canvas width 
    return false;
  } else {
    for(var i = 0; i < this.viruses.length; i++){
      if(y === this.viruses[i].y){                  //if the viruses is in the same row
        if (direction === "right" || direction === "left") {
          if (x === this.viruses[i].x) {            //if in the viruses is in same column
            return false;
          }
        }
      }
    }
  }
  return true;
};

Game.prototype.move = function (direction) {
  //console.log(direction)
  if(direction === "left"){ 
    if(this.validateMove(this.currentPiece.x - 25, this.currentPiece.y, direction)){
      this.currentPiece.x -= 25;
    } 
  } else if(direction === "right"){
    if(this.validateMove(this.currentPiece.x + 25, this.currentPiece.y, direction)){ 
      this.currentPiece.x += 25;
    }
  } else if(direction === "down"){
    for(var i = 0; i < this.viruses.length; i++){
      if(this.currentPiece.x === this.viruses[i].x){
        if(this.currentPiece.y === this.viruses[i].y - 25){
          if(this.currentPiece.color === this.viruses[i].color){ //if both square matches
            this.currentPiece.color = "#4B5267"; //replace color of currentPiece to canvas color
            this.viruses[i].color = "#4B5267";  //replace color of virus to canvas color
            this.soundEffect();
            this.viruses.splice(i, 1);  //delete from this.viruses
            this.addNewSquare(); //add new square once virus gets deleted
            this.addNewVirus(); //console.log("colors don't match");
            this.points++;
            this.scoreUpdate();
          } else {

            this.unmatched.push(this.currentPiece);
            // debugger
          //   if(!this.checkedUnmatched()){
          //     this.gameOver();  
          //     return;
          // }
            this.addNewSquare(); 
            this.addNewVirus();
          }
        // return;
        }
      }
    }
    for(var i = 0; i < this.unmatched.length; i++){
      if(this.currentPiece.x === this.unmatched[i].x){
        if(this.currentPiece.y === this.unmatched[i].y - 25){
          if(this.currentPiece.color === this.unmatched[i].color){ 
            this.currentPiece.color = "#4B5267"; 
            this.unmatched[i].color = "#4B5267";  
            this.unmatched.splice(i, 1);  
            this.addNewSquare(); 
            this.addNewVirus(); 
            this.points++;
            this.scoreUpdate();
          } else {
            this.unmatched.push(this.currentPiece);
            if(!this.checkedUnmatched()){
              this.gameOver();  
              return;
            }
            this.addNewSquare(); 
            this.addNewVirus();
          }
        return;
        }
      }
    }
    if(this.currentPiece.y >= this.canvas.height){
      this.addNewSquare(); //adds new square when currentPiece gets to bottom of canvas
  } else {
      this.currentPiece.y += 25;
    }
  }
};

Game.prototype.virusCoordinates = function () { //matches the coordinates of the square and virus
  let xCoords = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275]; 
  let yCoords = [125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375]; //level down the viruses
  var similar = true;
  if(this.viruses.length > 0){
  while(similar){  
    //console.log("Run virus coords");                                                
      var coords = [];
      coords[0] = xCoords[Math.floor(Math.random() * xCoords.length)];
      coords[1] = yCoords[Math.floor(Math.random() * yCoords.length)];
      for(var i = 0; i < this.viruses.length; i++){
          if(coords[0] !== this.viruses[i].x && coords[1] !== this.viruses[i].y){
            similar = false;
          } else {
            similar = true;
          break;
          }
        }
    }
  } else {
    var coords = [];
    coords[0] = xCoords[Math.floor(Math.random() * xCoords.length)];
    coords[1] = yCoords[Math.floor(Math.random() * yCoords.length)];
}
    return coords;
};

Game.prototype.scoreUpdate = function () {
 $("#ScoreBoard").text(this.points);
};

Game.prototype.pauseGame = function () {
    if (this.paused) {
      this.paused = false;
      this.goingDown();
    } else {
      this.paused = true;
      this.goingDown();
    }
}

Game.prototype.gameOver = function () {
 this.over = true;
 clearInterval(this.time);
 alert("GAME OVER!!!")
}

Game.prototype.checkedUnmatched = function () {
  var filtered = this.unmatched.filter(function(element){
    return element.y <= 0;
  })
return filtered.length === 0; //return true if no square overflow otherwise false
}

Game.prototype.soundEffect = function () {
  var sound = new Audio("/drm64_mario4.mp3"); // buffers automatically when created
  sound.play();
}




// Game.prototype.validateMove = function (x, y) {
//   if(x < this.canvas.width && x >= 0){
//     return true;
//   } else {
//     return false;
//   }
// };

// Game.prototype.validateMove = function (x, y) {
//   if((x < this.canvas.width && x >= 0) && (y < (this.canvas.height) || y <= 0)){
//     return true;
//   } else {
//     return false;
//   }
// };


//virus overlaps border???
// Game.prototype.virusCoordinates = function () {
//   if(this.viruses.length > 0){
//     var similar = true;
//     while(similar){                                                  
//       var x = [Math.floor(Math.random() * xCoords.length)]; // get random number between 1 and (this.canvas.width / 25) 
//       var y = [Math.floor(Math.random() * yCoords.length)];
//         for(var i = 0; i < this.viruses.length; i++){
//           if(x !== this.viruses[i].x && y !== this.viruses[i].y){
//             similar = false;
//           } else {
//             similar = true;
//           break;
//           }
//         }
//     }
//   } else {
//     var x = Math.floor(Math.random() * (this.canvas.width / 25) * 12);
//     var y = Math.floor(Math.random() * (this.canvas.height / 25) * 16);
//   }
// return [x, y];
// };






  


