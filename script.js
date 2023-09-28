//Spare 44 lines of code in HTML: create hole divs here
let divCreationArray = [
  [0, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, 31, 32, 33, 34],
  [35, 36, 37, 38, 39, 40, 41],
];
//using above array to give the board holes with class hole and ID of the index number
divCreationArray.forEach((row, rowIndex) => {
  row.forEach((column, columnIndex) => {
    const div = document.createElement("div");
    div.className = "hole";
    div.id = `c${columnIndex}_r${rowIndex}`;
    div.textContent = `c${columnIndex}_r${rowIndex}`;
    const boardContainer = document.querySelector(".holesContainer");
    boardContainer.appendChild(div);
  });
});

//constants
const playerNames = {
  1: "Purple",
  2: "Pink",
};

const gameOver = document.querySelectorAll(".gameOver");
const placeButtons = document.querySelectorAll(".triangleButton");
const playerTurn = document.querySelector("#turn");
const theWinner = document.getElementById("winner");
const playAgainButton = document.getElementById("playAgain");

//states that game must track:
//turn state: -1=yellow, 1=green
//board state: 0=empty cell, -1=yellow, 1=green
//game status: whether or not there's a winner yet + who won.
//--> null = game in process. -1 or 1 = player who won. T = tie game.
/*----- state variables -----*/
let board;
let turn;
let winner;
let currentPlayer;

/*----- functions -----*/
//STEP 1: at beginning of game, empty board. Player 1 goes first. Winner = null.
//when a placeButton is clicked, a function to check if there's a winner
//function checks for the same color next to the chip that was just dropped
//if that color exists, checks for another next to that one in a linear direction
//checks up to four, and if there's four (including self) then it's a win for that color
initialize();
//at beginning of a game and when replay is hit, board must be initialized:
playAgainButton.addEventListener("click", () => {
  console.log("working");
  initialize();
});

function initialize() {
  playAgainButton.style.display = "none";
  theWinner.style.display = "none";
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  for (rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
    for (
      columnIndex = board[rowIndex].length - 1;
      columnIndex >= 0;
      columnIndex--
    )
      board[rowIndex][columnIndex] = 0;
  }

  for (let element of document.querySelector(".holesContainer").children) {
    element.classList = "hole";
  }

  currentPlayer = 1;
  winner = null;
}

placeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const columnIndex = parseInt(button.getAttribute("data-column"), 10);
    console.log(columnIndex);
    makeMove(columnIndex);
    winningLogic();
    switchTurn(); // to pass columnIndex to the makeMove function
  });
});

//when a placeButton is clicked, a function to place the correct chip
function makeMove(columnIndex) {
  //turn the hole purple of the corresponding column and row with the highest indexes and value of 0
  // Find the lowest empty row in the specified column
  let row = null; //If the column is full, no row to fill (null)
  for (rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
    if (board[rowIndex][columnIndex] === 0) {
      board[rowIndex][columnIndex] = currentPlayer; //update board state
      row = rowIndex; //row to fill is row at the index where the value is 0
      break; //exits loop once an empty cell is found
    }
  }
  if (row !== null) {
    // Get the corresponding hole element by ID
    const holeToFill = document.getElementById(`c${columnIndex}_r${rowIndex}`);
    let holeColor = currentPlayer == 1 ? "purpleHole" : "pinkHole";
    holeToFill.classList.add(holeColor);
  }

  //switchTurn();
}

//when a placeButton is clicked:
function switchTurn() {
  currentPlayer = currentPlayer == 1 ? 2 : 1;
  let playerMemo = document.querySelector(`h2`);
  playerMemo.innerText = playerNames[currentPlayer] + "'s turn";
}

function winningLogic() {
  let winConditions = [
    [
      { x: -1, y: 0 },
      { x: -2, y: 0 },
      { x: -3, y: 0 },
    ],
    [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],

    [
      { x: 0, y: -1 },
      { x: 0, y: -2 },
      { x: 0, y: -3 },
    ],
    [
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 0, y: 3 },
    ],

    [
      { x: -1, y: -1 },
      { x: -2, y: -2 },
      { x: -3, y: -3 },
    ],
    [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ],

    [
      { x: -1, y: 1 },
      { x: -2, y: 2 },
      { x: -3, y: 3 },
    ],
    [
      { x: 1, y: -1 },
      { x: 2, y: -2 },
      { x: 3, y: -3 },
    ],
  ];

  for (let i = 0; i < board.length - 1; i++) {
    //iterates over rows of board
    for (
      let j = 0;
      j < board[i].length - 1;
      j++ //iterates over columns of board
    )
      for (let winCondition of winConditions) {
        //iterates over each win-condition array within the winning-conditions array
        let currTileOwner = board[i][j]; //assigs current tile owner to the column, row corrdinates
        if (currTileOwner == 0) {
          break;
        }
        let coord_offset1 = winCondition[0];
        let coord_offset2 = winCondition[1];
        let coord_offset3 = winCondition[2];
        try {
          if (
            board[i + coord_offset1.y][j + coord_offset1.x] == currTileOwner &&
            board[i + coord_offset2.y][j + coord_offset2.x] == currTileOwner &&
            board[i + coord_offset3.y][j + coord_offset3.x] == currTileOwner
          ) {
            console.log("winner!");
            playAgainButton.style.display = "block";
            theWinner.style.display = "block";
            theWinner.innerText = `${playerNames[currTileOwner]} Won!`;
            switchTurn();
          }
        } catch {
          console.log("out of bounds");
        }
      }
  }
}
