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
  "-1": "Pink",
};

// const Colors = {
//   1: "DarkOrchid",
//   "-1": "DeepPink",
//   0: "white",
// };

const gameOver = document.querySelectorAll(".gameOver");
const placeButtons = document.querySelectorAll(".triangleButton");
const playerTurn = document.querySelector("#turn");

//states that game must track:
//turn state: -1=yellow, 1=green
//board state: 0=empty cell, -1=yellow, 1=green
//game status: whether or not there's a winner yet + who won.
//--> null = game in process. -1 or 1 = player who won. T = tie game.
/*----- state variables -----*/
let board;
let turn;
let winner;

/*----- functions -----*/
//STEP 1: at beginning of game, empty board. Player 1 goes first. Winner = null.

//at beginning of a game, when replay is hit
function initialize() {
  board = [
    [1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, -1],
  ];
  currentPlayer = 1;
  winner = null;
  renderState();
  //call function: initialize (); --> only want to initailize when game begins
}
initialize();

//when a placeButton is clicked: a function to update the game's state
function renderState() {
  makeMove();
  // renderBoardColors();
  switchTurn();
  renderWinner();
}

//when a placeButton is clicked, a function to place the correct chip
function makeMove() {
  if (currentPlayer === 1) {
    //turn the hole purple of the corresponding column and row with the highest indexes and value of 0
    // Find the lowest empty row in the specified column
    let row = null; //If the column is full, no row to fill (null)
    for (rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
      if (board[rowIndex][columnIndex] === 0) {
        board[rowIndex][columnIndex] = 1; //update board state
        row = rowIndex; //row to fill is row at the index where the value is 0
        break; //exits loop once an empty cell is found
      }
    }
    if (row !== null) {
      // Get the corresponding hole element by ID
      const holeToFill = document.getElementById(
        `c${columnIndex}_r${rowIndex}`
      );
      // Add the purple-hole class to style it
      holeToFill.classList.add("purpleHole");
    }
  }

  if (currentPlayer === -1) {
    let row = null;
    for (rowIndex = board.length - 1; rowIndex >= 0; rowIndex--) {
      if (board[rowIndex][columnIndex] === 0) {
        board[rowIndex][columnIndex] = "-1";
        row = rowIndex;
        break;
      }
    }
    if (row !== null) {
      const holeToFill = document.getElementById(
        `c${columnIndex}_r${rowIndex}`
      );
      holeToFill.classList.add("pinkHole");
    }
  }
}

//when a placeButton is clicked:
function switchTurn() {
  currentPlayer = -currentPlayer; // Toggles between 1 and -1
  let playerMemo = document.querySelector(`h2`);
  playerMemo.innerText = playerNames[currentPlayer] + "'s turn";
}

// function renderBoardColors() {
//   board.forEach((rowArray, rowIndex) => {
//     rowArray.forEach((columnValue, columnIndex) => {
//       const divID = document.querySelector(`#c${columnIndex}_r${rowIndex}`);
//       console.log(divID);
//       divID.style.backgroundColor = Colors[columnValue];
//     });
//   });
// }
