let board;
let size = 8;
let empty = 0;
let black = 1;
let white = 2;
let human = black;
let player = human;

const togglePlayer = () => player = player == black ? white : black;

const validCoords = (r, c) => r >= 0 && r < size && c >= 0 && c < size;

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.trunc(Math.random() * (i + 1));

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

const validMove = (board, color, r, c) => {

    let opponent = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    if (board[r][c] != empty) return false;

    for (let dir of dirs) {

        if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == opponent) {

            for (let i = 2; i < size; i++) {
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) return true;
            }
        }
    }

    return false;
}

const randomMove = (board, color) => {

    let rows = shuffle([0,1,2,3,4,5,6,7]);
    let cols = shuffle([0,1,2,3,4,5,6,7]);

    for (let r of rows) {
        for (let c of cols) {
            if (validMove(board, color, r, c)) return {r, c};
        }
    }

    return null;
}

const availableMoves = (board, color) => {

    let moves = [];

    for (let r = 0 ; r < size; r++) {
        for(let c = 0; c < size; c++) {
            if (validMove(board, color, r, c)) moves.push({r, c});
        }
    }

    return moves;
}

const makeMove = (board, color, move) => {

    let {r, c} = move;
    let flippedDisks = [move];
    let opponent = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    for (let dir of dirs) {

        let tempFlipped = [];

        if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == opponent) {

            tempFlipped.push({r:r + dir[0], c:c + dir[1]});

            for (let i = 2; i < size; i++) {
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == opponent) {
                    tempFlipped.push({r:r + dir[0] * i, c:c + dir[1] * i});
                }
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) {
                    flippedDisks = flippedDisks.concat(tempFlipped);
                    break;
                }
            }
        }
    }

    flippedDisks.forEach(disk => board[disk.r][disk.c] = color);

    return flippedDisks;
}

const boardFull = (board) => {

    for (let r = 0 ; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] == empty) return false;
        }
    }

    return true;
} 

const gameOver = (board) => {

    let opponent = player == black ? white : black;
    
    return boardFull(board) || (availableMoves(board, player).length == 0 &&
           availableMoves(board, opponent).length == 0);
}

const aiTurn = ({initial = false} = {}) => {

    let timeLimit = 1500;
    let startTime = Date.now();
    let moves = [{r:2,c:3},{r:3,c:2},{r:4,c:5},{r:5,c:4}];
    let move = initial ? moves[Math.trunc(Math.random() * 4)] :
                         mcts(board, player, startTime, timeLimit);

    if (move == null) {

        togglePlayer();

        if (availableMoves(board, player).length == 0) {
            setTimeout(endGame, 1000);
            return;
        }

        showHints();
        setTimeout(enableTouch, 200);
        
        return;
    }

    let disks = makeMove(board, player, move);

    setTimeout(flipDisks, 20, disks, player);

    togglePlayer();

    if (availableMoves(board, player).length == 0) {

        togglePlayer();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 50);
            });
        }); 

        return;
    }

    setTimeout(() => {
        showHints();
        setTimeout(enableTouch, 200);
    }, 1100);
}

const humanTurn = (e) => {

    let square = e.currentTarget;
    let [r, c] = squareCoords(square);
    let move = {r, c};

    if (!validMove(board, player, r, c)) return;

    let disks = makeMove(board, player, move);

    disableTouch();
    hideHints();
    flipDisks(disks, player);
    togglePlayer();

    if (gameOver(board)) {
        setTimeout(endGame, 1000);
        return;
    }
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            aiTurn();
        });
    });  
}

const winner = (board) => {

    let whites = 0;
    let blacks = 0;

    for (let r = 0 ; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (board[r][c] == white) whites++;
            if (board[r][c] == black) blacks++;
        }
    }

    let diff = blacks - whites;

    return [diff > 0 ? black : diff < 0 ? white : 0, blacks, whites];
}

const newGame = () => {

    human = human == black ? white : black;
    player = black;

    clearBoard();
    initBoard();
    setTimeout(startingSetup, 1500);

    if (human == black) {
        setTimeout(() => {
            showHints();
            setTimeout(enableTouch, 200);
        }, 1500 + 600 * 4);
        return;
    }   

    setTimeout(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn({initial: true});
            });
        });
    }, 1500 + 600 * 4 + 500);
}

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
}

const init = () => {
    registerServiceWorker();
    disableTapZoom();
    setBoardSize();
    initBoard();
    showBoard();
    setTimeout(startingSetup, 1000)
    setTimeout(showHints, 1000 + 4 * 600);
    setTimeout(enableTouch, 1000 + 4 * 600 + 200);
}

window.onload = () => document.fonts.ready.then(init);