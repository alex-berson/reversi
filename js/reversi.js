let board = [];
let empty = 0;
let black = 1;
let white = 2;

const showBoard = () => document.querySelector("body").style.opacity = 1;

const resetBoard = () => board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

const setBoard = () => {

    board = [[0,0,0,0,0,0,0,0],
             [0,2,0,0,0,0,0,0],
             [0,2,0,0,0,0,0,0],
             [0,2,1,2,1,0,0,0],
             [0,1,0,1,2,0,0,0],
             [0,0,2,0,1,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0]];
}

const redrawBoard = () => {

    let disks = document.querySelectorAll('.disk');

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {
            if (board[r][c] == black) disks[r * 8 + c].classList.add("black");
            if (board[r][c] == white) disks[r * 8 + c].classList.add("white");

            if (board[r][c] == -1) disks[r * 8 + c].classList.add("gray");
        }
    }
}


const validMove = (r, c, color) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

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

const validMoves = (color) => {

    let moves = [];

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] != empty) continue;
            if (validMove(r, c, color)) moves.push([r, c]);
        }
    }

    for (let move of moves) {
        board[move[0]][move[1]] = -1
    }

    redrawBoard();
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

// const disableTouch = () => {
//     document.querySelectorAll('.square').forEach((tile) => {
//       tile.removeEventListener('touchstart', startMove);
//       tile.removeEventListener('mousedown', startMove);
//     });
// }

// const enableTouch = () => {
//     document.querySelectorAll('.square').forEach((tile) => {
//       tile.addEventListener('touchstart', startMove);
//       tile.addEventListener('mousedown', startMove);
//     });
// }


const init = () => {

    // disableTapZoom();

    setBoard();

    redrawBoard();

    setBoardSize();
    
    showBoard();

    validMoves(white);

    // setTimeout(enableTouch, 1000);

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
