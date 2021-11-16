let board = [];
let empty = 0;
let black = 1;
let white = 2;
let gray = 100;
let blackDot = -1;
let whiteDot = -2;
let pass = false;
let timeLimit = 2000;
 
let set = 0;
let statWin = [0,0];

let firstColor = color = white;

const resetBoard = () => board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

// const pause = (m) => await new Promise(r => setTimeout(r, m));

const reverseColor = () => color = color == black ? white : black;

const shuffle = ([...array]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const setBoard = () => {

    board = [[0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,2,1,0,0,0],
             [0,0,0,1,2,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0]];
}

const validCoords = (r, c) => {

    if (r < 0 || r > 7 || c < 0 || c > 7) return false;

    return true;
}

const validMove = (board, color, r, c) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    if (board[r][c] != empty) return false;

    for (let dir of dirs) {
        if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == reversedColor) { 
            for (let i = 2; i < 8; i++) {
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) return true;
            }
        }
    }

    return false;
}

const getValidMove = (board, color) => {

    let rows = shuffle([0,1,2,3,4,5,6,7]);
    let columns = shuffle([0,1,2,3,4,5,6,7]);

    // let cells = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];

    // cells = shuffle(cells);

    // console.log(cells);

    for (let row of rows) {

    // for (let i = 0; i < 8; i ++) {
        
        // let columns = shuffle([0,1,2,3,4,5,6,7]);

        for (let column of columns) {  

        // for (let j = 0; j < 8; j ++) {

            // if (validMove(board, color, rows[i], columns[j])) return [rows[i], columns[j]];

            if (validMove(board, color, row, column)) return [row, column];

        }
    }

    // for (let i = 0; i < 64; i++) {

    //     let row = Math.floor(cells[i] / 8);
    //     let column = cells[i] % 8;

    //     if (validMove(board, color, row, column)) return [row, column];
    // }

    return null;
}

// const checkMove = (board, color, r ,c) => {

//     let reversedColor = color == black ? white : black;
//     let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

//     if (board[r][c] != empty) return false;

//     let revesedDisks = [[r, c]];

//     for (let dir of dirs) {
//         let tempRevesed = [];

//         if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == reversedColor) { 
//             tempRevesed.push([r + dir[0],c + dir[1]]);
//             for (let i = 2; i < 8; i++) {
//                 if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
//                 if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == reversedColor) {
//                     tempRevesed.push([r + dir[0] * i, c + dir[1] * i]);
//                 }
//                 if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) {
//                     revesedDisks  = revesedDisks.concat(tempRevesed);
//                     break;
//                 }
//             }
//         }
//     }

//     if (revesedDisks.length != 1) {
//         return revesedDisks;
//     } else {
//         return false;
//     }
// }

// const getValidMove2 = (board, color) => {

//     let rows = shuffle([0,1,2,3,4,5,6,7]);
//     let columns = shuffle([0,1,2,3,4,5,6,7]);

//     for (let row of rows) {

//         for (let column of columns) {  
            
//             let move = checkMove(board, color, row, column);

//             if (move) return move;
//         }
//     }

//     return [];
// }

const getValidMoves = (board, color) => {

    let moves = [];

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (validMove(board, color, r, c)) moves.push([r, c]);
        }
    }

    return moves;
}

const makeMove = (board, color, r ,c) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    let flippedDisks = [[r, c]];

    for (let dir of dirs) {
        let tempFlipped = [];

        if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == reversedColor) { 
            tempFlipped.push([r + dir[0],c + dir[1]]);
            for (let i = 2; i < 8; i++) {
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == reversedColor) {
                    tempFlipped.push([r + dir[0] * i, c + dir[1] * i]);
                }
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) {
                    flippedDisks  = flippedDisks.concat(tempFlipped);
                    break;
                }
            }
        }
    }

    flippedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

    // return flippedDisks;
}

const setHints = (moves) => {
    for (let move of moves) {
        board[move[0]][move[1]] = gray;
    }
} 

const clearHints = () => {
    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] == gray) board[r][c] = 0;
            if (board[r][c] == blackDot) board[r][c] = black;
            if (board[r][c] == whiteDot) board[r][c] = white;
        }
    }
}

let winner = (board) => {

    let whites = 0;
    let blacks = 0;

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] == white) whites++;
            if (board[r][c] == black) blacks++;   
        }
    }

    switch (Math.sign(blacks - whites)) {
        case 1:
            return [1, blacks, whites];
        case 0:
            return [0, blacks, whites];
        case -1:
            return [2, blacks, whites];
    }

    // return [Math.sign(blacks - whites), blacks, whites];
}

let full = (board) => {

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] != black && board[r][c] != white) return false;
        }
    }
    return true;
} 

const init = async() => {

    firstColor = firstColor == black ? white : black;

    color = firstColor;

    set++;

    console.log("SET: ", set);

    disableTapZoom();

    // setBoard();

    // redrawBoard();

    setBoardSize();
    
    showBoard();

    setBoard();

    setHints(getValidMoves(board, color));

    redrawBoard();

    clearHints();

    await new Promise(r => setTimeout(r, 1000));

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            aiTurn();
        });
    });

    setTimeout(enableTouch, 1000);
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
