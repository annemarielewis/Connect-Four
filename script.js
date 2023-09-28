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

/*----- functions -----*/
//STEP 1: at beginning of game, empty board. Player 1 goes first. Winner = null.
//when a placeButton is clicked, a function to check if there's a winner
//function checks for the same color next to the chip that was just dropped
//if that color exists, checks for another next to that one in a linear direction
//checks up to four, and if there's four (including self) then it's a win for that color
initialize();
//at beginning of a game and when replay is hit, board must be initialized:
playAgainButton.addEventListener("click", () => {
  initialize();
});

function initialize() {
  board = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];
  currentPlayer = 1;
  winner = null;
  masterFunction();
}

//update state every turn (every time a button is clicked)
function masterFunction() {
  placeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Your event handling logic here
      makeMove();
      winningLogic();
      switchTurn();
    });
  });
}

placeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const columnIndex = parseInt(button.getAttribute("data-column"), 10);
    makeMove(columnIndex); // to pass columnIndex to the makeMove function
  });
});

//when a placeButton is clicked, a function to place the correct chip
function makeMove(columnIndex) {
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
  //switchTurn();
}

//when a placeButton is clicked:
function switchTurn() {
  currentPlayer = -currentPlayer; // Toggles between 1 and -1
  let playerMemo = document.querySelector(`h2`);
  playerMemo.innerText = playerNames[currentPlayer] + "'s turn";
}

function winningLogic() {
  //winnimg logic for -1 (pink) rows
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    if (
      (board[rowIndex] === -1 &&
        board[rowIndex + 1] === -1 &&
        board[rowIndex + 2] === -1 &&
        board[rowIndex + 3] === -1) ||
      (board[rowIndex] === -1 &&
        board[rowIndex - 1] === -1 &&
        board[rowIndex - 2] === -1 &&
        board[rowIndex - 3] === -1)
    ) {
      gameOver.style.display = "flex";
      theWinner.innerText = "Pink Won!";
    }
  }
  //winnimg logic for -1 (pink) columns
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < board[0].length; columnIndex++) {
      if (
        (board[rowIndex][columnIndex] === -1 &&
          board[rowIndex + 1][columnIndex] === -1 &&
          board[rowIndex + 2][columnIndex] === -1 &&
          board[rowIndex + 3][columnIndex] === -1) ||
        (board[rowIndex][columnIndex] === -1 &&
          board[rowIndex - 1][columnIndex] === -1 &&
          board[rowIndex - 2][columnIndex] === -1 &&
          board[rowIndex - 3][columnIndex] === -1)
      ) {
        gameOver.style.display = "flex";
        theWinner.innerText = "Pink Won!";
      }
    }
  }
  //winnimg logic for 1 (purple) rows
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    //
    if (
      (board[rowIndex] === 1 &&
        board[rowIndex + 1] === 1 &&
        board[rowIndex + 2] === 1 &&
        board[rowIndex + 3] === 1) ||
      (board[rowIndex] === 1 &&
        board[rowIndex - 1] === 1 &&
        board[rowIndex - 2] === 1 &&
        board[rowIndex - 3] === 1)
    ) {
      gameOver.style.display = "flex";
      theWinner.innerText = "Purple Won!";
    }
  }

  //winnimg logic for pink diagonals
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < board[0].length; columnIndex++) {
      if (
        (columnIndex + 3 < board[rowIndex].length &&
          rowIndex + 3 < board.length &&
          board[rowIndex][columnIndex] === -1 &&
          board[rowIndex + 1][columnIndex + 1] === -1 &&
          board[rowIndex + 2][columnIndex + 2] === -1 &&
          board[rowIndex + 3][columnIndex + 3] === -1) ||
        (columnIndex + 3 < board[rowIndex].length &&
          rowIndex - 3 >= 0 &&
          columnIndex - 3 >= 0 &&
          board[rowIndex][columnIndex] === -1 &&
          board[rowIndex - 1][columnIndex - 1] === -1 &&
          board[rowIndex - 2][columnIndex - 2] === -1 &&
          board[rowIndex - 3][columnIndex - 3] === -1)
      ) {
        gameOver.style.display = "flex";
        theWinner.innerText = "Pink Won!";
      }
    }
  }

  //winning logic for purple diagonals
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let columnIndex = 0; columnIndex < board[0].length; columnIndex++) {
      if (
        (columnIndex + 3 < board[rowIndex].length &&
          rowIndex + 3 < board.length &&
          board[rowIndex][columnIndex] === 1 &&
          board[rowIndex + 1][columnIndex + 1] === 1 &&
          board[rowIndex + 2][columnIndex + 2] === 1 &&
          board[rowIndex + 3][columnIndex + 3] === 1) ||
        (columnIndex + 3 < board[rowIndex].length &&
          rowIndex - 3 >= 0 &&
          columnIndex - 3 >= 0 &&
          board[rowIndex][columnIndex] === 1 &&
          board[rowIndex - 1][columnIndex - 1] === 1 &&
          board[rowIndex - 2][columnIndex - 2] === 1 &&
          board[rowIndex - 3][columnIndex - 3] === 1)
      ) {
        gameOver.style.display = "flex";
        theWinner.innerText = "Purple Won!";
      }
    }
  }
}

// const Colors = {
//   1: "DarkOrchid",
//   "-1": "DeepPink",
//   0: "white",
// };

// function renderBoardColors() {
//   board.forEach((rowArray, rowIndex) => {
//     rowArray.forEach((columnValue, columnIndex) => {
//       const divID = document.querySelector(`#c${columnIndex}_r${rowIndex}`);
//       console.log(divID);
//       divID.style.backgroundColor = Colors[columnValue];
//     });
//   });
// }
