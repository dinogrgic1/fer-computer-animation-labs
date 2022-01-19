const BOX_SIZE = 20;
const FROM_TOP = 50;

var fps = 10;
gridLn = 30;
var playing = false;

var world = [];
initWorld();

var toggleButton;
var clearButton;

// drawing the popuplated cells at the start of the game
function mousePressed() {
  let row = (mouseX - (mouseX % BOX_SIZE)) / BOX_SIZE;
  let col = (mouseY - (mouseY % BOX_SIZE)) / BOX_SIZE;
  if (row <= gridLn && col <= gridLn) {
    world[row][col] = world[row][col] == 1 ? 0 : 1;
    draw();
  }
}

function startGame() {
  playing = !playing;
  frameRate(playing == true ? fps : 0);
  toggleButton.style("color", playing ? "green" : "red");
}


function initWorld() {
  if(playing) {
      return;
  }
  
  world = [];
    for (var r = 0; r < gridLn; r++) {
    var rowArr = [];
    for (let c = 0; c < gridLn; c++) {
      rowArr.push(0);
    }
    world.push(rowArr);
  }
  return world;
}

function setup() {
  // Runs on start
  frameRate(fps);
  createCanvas(1500, 1500);
  toggleButton = createButton("Play / Pause");
  toggleButton.position(0, 600);
  toggleButton.style("color", "red");
  toggleButton.mousePressed(startGame);
  
  clearButton = createButton("Clear");
  clearButton.position(0, 630);
  clearButton.mousePressed(initWorld);
}

// number of alive neighbors
function aliveNeighbors(row, col) {
  var alive = 0;
  for (var i = -1; i < 2; i++) {
    for(var j = -1; j < 2; j++) {
      
      
      if (col + j < 0 || col + j >= gridLn) {
        continue;
      }
      
      if (row + i < 0 || row + i >= gridLn) {
        continue;
      }
      
      if (i == 0 && j == 0){
        continue;    
      }
      
      alive += world[row + i][col + j];
    }
  }
 
  return alive;
}

function draw() {
  world.forEach((rows, row) => {
    rows.forEach((colVal, col) => {
      fill(colVal == 1 ? "blue" : "transparent");
      rect(row * BOX_SIZE, col * BOX_SIZE, BOX_SIZE, BOX_SIZE);
    });
  });

  if (!playing) {
    return;
  }
  
  
  var tmpWorld = [];

  for (var i = 0; i < world.length; i++)
      tmpWorld[i] = world[i].slice();
  
  for (var j = 0; j < world.length; j++) {
    let col = world[j];
    
    for (var i = 0; i < col.length; i++) {
      let neighbors = aliveNeighbors(j, i);
      
      // If alive and less then two alive neighbors
      if (world[j][i] == 1 && neighbors <= 1) {
        tmpWorld[j][i] = 0;
      
      // If alive and more then 3 neighbors
      } else if (world[j][i] == 1 && neighbors >= 4) {
        tmpWorld[j][i] = 0;
        
      // If dead and 3 live neighbors
      } else if (world[j][i] == 0 && neighbors == 3) {
        tmpWorld[j][i] = 1;
      }
    }
  }
  world = tmpWorld;
}
