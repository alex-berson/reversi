let board = [];
let empty = 0;
let black = 1;
let white = 2;
let gray = -1;

let color = white;

const showBoard = () => document.querySelector("body").style.opacity = 1;

const resetBoard = () => board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

const touchScreen = () => matchMedia('(hover: none)').matches;

const setBoard = () => {

    board = [[0,0,0,0,0,0,0,0],
             [0,2,0,0,0,0,0,0],
             [0,2,0,0,0,0,0,0],
             [0,2,1,2,1,0,0,0],
             [0,1,1,1,2,0,0,0],
             [0,0,2,0,1,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0]];
}

const redrawBoard = () => {

    let disks = document.querySelectorAll('.disk');

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {

            disks[r * 8 + c].style = "";
            disks[r * 8 + c].className = "disk";

            if (board[r][c] == black) disks[r * 8 + c].classList.add("black");
            if (board[r][c] == white) disks[r * 8 + c].classList.add("white");

            if (board[r][c] == -1) disks[r * 8 + c].classList.add("gray");
        }
    }
}


const validMove = (r, c) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    if (board[r][c] != empty) return false;

    for (let dir of dirs) {
        try {
            if (board[r + dir[0]][c + dir[1]] == reversedColor) { 
                for (let i = 2; i < 8; i++) {
                    if (board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                    if (board[r + dir[0] * i][c + dir[1] * i] == color) return true;
                }
            }
        } catch {};
    }
    return false;
}

const validMoves = () => {

    let moves = [];

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (validMove(r, c)) moves.push([r, c]);
        }
    }

    for (let move of moves) {
        board[move[0]][move[1]] = -1
    }
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const setBoardSize = () => {

    if (screen.height > screen.width) {
         var boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
    } else {
         var boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
    }

    let holeSize = Math.ceil(boardSize / 8 / 1.2 / 2) * 2;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    document.documentElement.style.setProperty('--hole-size', holeSize + 'px');
}

const clearGray = () => {
    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] == gray) board[r][c] = 0;
        }
    }
}

const squareCoords = (touchedSquare) => {

    let squares = document.querySelectorAll('.square');

    for (let [i, square] of squares.entries()) {
        if (square == touchedSquare) return [Math.floor(i / 8), i % 8];
    }
}

const reverseColor = () => color = color == black ? white : black;

const getReversedDisks = (r ,c) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    let revesedDisks = [[r, c]];

    for (let dir of dirs) {
        try {
            let tempRevesed = [];

            if (board[r + dir[0]][c + dir[1]] == reversedColor) { 
                tempRevesed.push([r + dir[0],c + dir[1]]);
                for (let i = 2; i < 8; i++) {
                    if (board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                    if (board[r + dir[0] * i][c + dir[1] * i] == reversedColor) {
                        tempRevesed.push([r + dir[0] * i, c + dir[1] * i]);
                    }
                    if (board[r + dir[0] * i][c + dir[1] * i] == color) {
                        revesedDisks  = revesedDisks.concat(tempRevesed);
                        break;
                    }
                }
            }
        } catch {};
    }

    return revesedDisks;
}

const humanTurn = (e) => {    

    let square = e.currentTarget;
    let [r, c] = squareCoords(square);

    console.log(r, c);

    clearGray();

    if (!validMove(r, c)) return;

    let reversedDisks = getReversedDisks(r, c);

    console.log(reversedDisks);

    reversedDisks.forEach(disk => {
        board[disk[0]][disk[1]] = color;
    });

    reverseColor();

    validMoves();

    redrawBoard();
}

const enableTouch = () => {
    for (let cell of document.querySelectorAll('.square')){
        if (touchScreen()){
            cell.addEventListener("touchstart", humanTurn);
        } else {
            cell.addEventListener("mousedown", humanTurn);
        }
    }
}

const disableTouch = () => {
    for (let cell of document.querySelectorAll('.square')){
        if (touchScreen()){
            cell.removeEventListener("touchstart", humanTurn);
        } else {
            cell.removeEventListener("mousedown", humanTurn);
        }
    }
}


const init = () => {

    // disableTapZoom();

    setBoard();

    redrawBoard();

    setBoardSize();
    
    showBoard();

    validMoves();

    redrawBoard();

    setTimeout(enableTouch, 1000);

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
