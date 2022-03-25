let board = [];
const empty = 0;
const black = 1;
const white = 2;
const timeLimit = 1500;
let playerColor = black;
let color = playerColor;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => {
                console.log('Service worker registered!', reg);
            })
            .catch(err => {
                console.log('Service worker registration failed: ', err);
            });
    });
} 

const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

const reverseColor = () => color = color == black ? white : black;

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]]; 
    }

    return array;
}

const initBoard = () => {

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

const randomMove = (board, color) => {

    let rows = shuffle([0,1,2,3,4,5,6,7]);
    let columns = shuffle([0,1,2,3,4,5,6,7]);

    for (let row of rows) {
        for (let column of columns) {  
            if (validMove(board, color, row, column)) return [row, column];
        }
    }

    return null;
}

const availableMoves = (board, color) => {

    let moves = [];

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (validMove(board, color, r, c)) moves.push([r, c]);
        }
    }

    return moves;
}

const makeMove = (board, color, r, c) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    let flippedDisks = [[r, c, 0]];

    for (let dir of dirs) {

        let tempFlipped = [];

        if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == reversedColor) { 
            tempFlipped.push([r + dir[0],c + dir[1], 1]);
            for (let i = 2; i < 8; i++) {
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == reversedColor) {
                    tempFlipped.push([r + dir[0] * i, c + dir[1] * i, i]);
                }
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) {
                    flippedDisks  = flippedDisks.concat(tempFlipped);
                    break;
                }
            }
        }
    }

    flippedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

    return flippedDisks;
}

const aiTurn = () => {

    let startTime = new Date();
    let move = mcts(board, color, startTime, timeLimit);

    if (move == null) {

        reverseColor();

        if (availableMoves(board, color).length == 0) {
            setTimeout(gameOver, 1000);
            return;
        }

        showHints(availableMoves(board, color));
        setTimeout(enableTouch, 0);
        return;
    }

    let disks = makeMove(board, color, move[0], move[1]);

    setTimeout(flipDisks, 20, disks, color);

    reverseColor();

    if (availableMoves(board, color).length == 0) {
        reverseColor();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 50);
            });
        }); 
        return;
    }

    setTimeout(() => {
        showHints(availableMoves(board, color));
        enableTouch();
    }, 1100);
}

const humanTurn = (e) => {  

    let square = e.currentTarget;
    let [r, c] = squareCoords(square);

    if (!validMove(board, color, r, c)) return;

    let disks = makeMove(board, color, r, c);

    disableTouch();
    hideHints();
    flipDisks(disks, color);
    reverseColor();

    if (terminal(board)) {
        setTimeout(gameOver, 1000);
        return;
    }
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setTimeout(aiTurn, 0);
        });
    });  
    
}

const terminal = (board) => {

    let revercedColor = color == black ? white : black;
    
    return boardFull(board) || (availableMoves(board, color).length == 0 && availableMoves(board, revercedColor).length == 0);
}

const winner = (board) => {

    let whites = 0;
    let blacks = 0;

    for (let r = 0 ; r < 8; r++) {
        for (let c = 0; c < 8; c++ ) {  
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
}

const boardFull = (board) => {

    for (let r = 0 ; r < 8; r++) {
        for (let c = 0; c < 8; c++ ) {  
            if (board[r][c] != black && board[r][c] != white) return false;
        }
    }
    return true;
} 

const gameOver = () => {

    setTimeout(countDisks, 500);

    setTimeout(() => {
        if (touchScreen()){
            document.querySelector('.board').addEventListener("touchstart", newGame);
        } else {
            document.querySelector('.board').addEventListener("mousedown", newGame);
        }
    }, 500 + 50 + 50 * (winner(board)[1] + winner(board)[2]));
}

const newGame = () => {

    if (touchScreen()){
        document.querySelector('.board').removeEventListener("touchstart", newGame);
    } else {
        document.querySelector('.board').removeEventListener("mousedown", newGame);
    }

    playerColor = playerColor == black ? white : black;
    color = black;

    initBoard();
    clearBoard();
    setTimeout(initialDisksPlacement, 1500);

    if (playerColor == black) {
        setTimeout(() => {
            showHints(availableMoves(board, color));
            setTimeout(enableTouch, 200);
        }, 1500 + 600 * 4);
        return;
    }   

    setTimeout(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn();
            });
        });
    }, 1500 + 600 * 4 - 550);
}

const init = () => {

    disableTapZoom();
    setBoardSize();
    initBoard();
    clearBoard();
    showBoard();
    setTimeout(initialDisksPlacement, 1000)
    setTimeout(() => showHints(availableMoves(board, color)), 1000 + 4 * 600);
    setTimeout(enableTouch, 1000 + 4 * 600 + 200);
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
