// HTML Elements
const statusDiv = document.querySelector('.status');
const resetDiv = document.querySelector('.reset');
const cellDivs = document.querySelectorAll('.game-cell');
const singleDiv = document.querySelector('.single');
const multiDiv = document.querySelector('.multi');

// game constants
const xSymbol = '×';
const oSymbol = '○';

// game variables
let gameIsLive = true;
let xIsNext = true;
let isSingle = false;
// for minimax
let board;
let human = "x";
let bot = "o";
let index1,index2,index3;


// functions
const letterToSymbol = (letter) => letter === 'x' ? xSymbol : oSymbol;

const handleWin = (letter) => {
  gameIsLive = false;
  if (letter === 'x') {
    statusDiv.innerHTML = `${letterToSymbol(letter)} has won!`;
  } else {
    statusDiv.innerHTML = `<span>${letterToSymbol(letter)} has won!</span>`;
  }
};


const checkGameStatus = () => {
  const topLeft = cellDivs[0].classList[2];
  const topMiddle = cellDivs[1].classList[2];
  const topRight = cellDivs[2].classList[2];
  const middleLeft = cellDivs[3].classList[2];
  const middleMiddle = cellDivs[4].classList[2];
  const middleRight = cellDivs[5].classList[2];
  const bottomLeft = cellDivs[6].classList[2];
  const bottomMiddle = cellDivs[7].classList[2];
  const bottomRight = cellDivs[8].classList[2];

  if (topLeft && topLeft === topMiddle && topLeft === topRight) {
    handleWin(topLeft);
    cellDivs[0].classList.add('won');
    cellDivs[1].classList.add('won');
    cellDivs[2].classList.add('won');
  } else if (middleLeft && middleLeft === middleMiddle && middleLeft === middleRight) {
    handleWin(middleLeft);
    cellDivs[3].classList.add('won');
    cellDivs[4].classList.add('won');
    cellDivs[5].classList.add('won');
  } else if (bottomLeft && bottomLeft === bottomMiddle && bottomLeft === bottomRight) {
    handleWin(bottomLeft);
    cellDivs[6].classList.add('won');
    cellDivs[7].classList.add('won');
    cellDivs[8].classList.add('won');
  } else if (topLeft && topLeft === middleLeft && topLeft === bottomLeft) {
    handleWin(topLeft);
    cellDivs[0].classList.add('won');
    cellDivs[3].classList.add('won');
    cellDivs[6].classList.add('won');
  } else if (topMiddle && topMiddle === middleMiddle && topMiddle === bottomMiddle) {
    handleWin(topMiddle);
    cellDivs[1].classList.add('won');
    cellDivs[4].classList.add('won');
    cellDivs[7].classList.add('won');
  } else if (topRight && topRight === middleRight && topRight === bottomRight) {
    handleWin(topRight);
    cellDivs[2].classList.add('won');
    cellDivs[5].classList.add('won');
    cellDivs[8].classList.add('won');
  } else if (topLeft && topLeft === middleMiddle && topLeft === bottomRight) {
    handleWin(topLeft);
    cellDivs[0].classList.add('won');
    cellDivs[4].classList.add('won');
    cellDivs[8].classList.add('won');
  } else if (topRight && topRight === middleMiddle && topRight === bottomLeft) {
    handleWin(topRight);
    cellDivs[2].classList.add('won');
    cellDivs[4].classList.add('won');
    cellDivs[6].classList.add('won');
  } else if (topLeft && topMiddle && topRight && middleLeft && middleMiddle && middleRight && bottomLeft && bottomMiddle && bottomRight) {
    gameIsLive = false;
    statusDiv.innerHTML = 'Tie Game!';
  }

  //game continues if no win conditions are met
  else {
    xIsNext = !xIsNext;
    if (xIsNext) {
      statusDiv.innerHTML = `${xSymbol} is next`;
    } else {
      statusDiv.innerHTML = `<span>${oSymbol} is next</span>`;
    }
  }


};

//implements recursive minimax algorithm 
function minimax(board,player) {

  let freePositions = freePositionsList(board);
  let finalMove = {};

  if(winCondition(board,human)) {return {score : -10};}
  else if(winCondition(board,bot)){return {score : 10};}//this means that we are maximizing score for 'o' wins
  else if(freePositions.length==0){return {score: 0}}//tie game


  if(player == "o")
  {
    let bestScore = -Infinity;
    let bestIndex = -1;
    for(let i=0;i<freePositions.length;i++)
    {
      board[freePositions[i]] = "o";
      let branch = minimax(board,"x");
      if(branch.score > bestScore){
        bestScore = branch.score;
        bestIndex = freePositions[i];
      }
      board[freePositions[i]] = freePositions[i];
    }
    finalMove.index = bestIndex;
    finalMove.score = bestScore;
  }
  else
  {
    let bestScore = Infinity;
    let bestIndex = -1;
    for(let i=0;i<freePositions.length;i++)//loops through each possible move
    {
      board[freePositions[i]] = "x";
      let branch = minimax(board,"o");//recursive call of minimax to find the score at the end of the tree
      if(branch.score < bestScore){
        bestScore = branch.score;
        bestIndex = freePositions[i];
      }
      board[freePositions[i]] = freePositions[i];//resets board back to normal for the next loop
    }
    finalMove.index = bestIndex;
    finalMove.score = bestScore;
  }
  return finalMove;
}

//finds all the open positions on the board
function freePositionsList(board) {
  return board.filter(function (value) {return value!="x" && value!="o";})
}

//checks if there is a win
function winUtil(board, player, x, y, z) {
  if (board[x]==player && board[y]==player && board[z]==player) {
    index1 = x, index2 = y, index3 = z;
    return true;
  }
  return false;
}

//runs through all possible win conditions using winUtil to check for a win
function winCondition(board, player) {
  return(winUtil(board,player,0,1,2) ||
      winUtil(board,player,3,4,5) ||
      winUtil(board,player,6,7,8) ||
      winUtil(board,player,0,3,6) ||
      winUtil(board,player,1,4,7) ||
      winUtil(board,player,2,5,8) ||
      winUtil(board,player,0,4,8) ||
      winUtil(board,player,2,4,6))
}
// event Handlers
const handleReset = () => {
  isSingle = false;
  xIsNext = true;
  statusDiv.innerHTML = `${xSymbol} is next`;
  for (const cellDiv of cellDivs) {
    cellDiv.classList.remove('x');
    cellDiv.classList.remove('o');
    cellDiv.classList.remove('won');
  }
  gameIsLive = true;
};


const handleCellClick = (e) => {
  const classList = e.target.classList;

  const takenDiv = e.target.classList[1];

  if (!gameIsLive || classList[2] === 'x' || classList[2] === 'o') {
    return;
  }
  if (xIsNext) {
    classList.add('x');
    checkGameStatus();
  }
  else {
    classList.add('o');
    checkGameStatus();
  }
  if (isSingle){
    board[parseInt(takenDiv)] = "x";
    let bestSpot = parseInt(minimax(board,bot).index);
    board[bestSpot] = 'o';
    cellDivs[bestSpot].classList.add('o');
    checkGameStatus();
  }
};

const handleSingle = () => {
  isSingle = true;
  board = ["0","1","2","3","4","5","6","7","8"];

  xIsNext = true;
  statusDiv.innerHTML = `${xSymbol} is next`;
  for (const cellDiv of cellDivs) {
    cellDiv.classList.remove('x');
    cellDiv.classList.remove('o');
    cellDiv.classList.remove('won');
  }
  gameIsLive = true;
};

// event listeners

multiDiv.addEventListener('click', handleReset)
singleDiv.addEventListener('click', handleSingle);

if (isSingle){
  resetDiv.addEventListener('click', handleSingle);
}
else{
  resetDiv.addEventListener('click', handleReset);
}



for (const cellDiv of cellDivs) {
  cellDiv.addEventListener('click', handleCellClick)
}
