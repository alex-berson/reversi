let board = [];
let empty = 0;
let black = 1;
let white = 2;
let gray = 100;
let blackDot = -1;
let whiteDot = -2;
let draw = false;
let timeLimit = 2000;
let set = 0;
let statWin = [0,0];

let firstColor = color = white;

const showBoard = () => document.querySelector("body").style.opacity = 1;

const resetBoard = () => board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

const touchScreen = () => matchMedia('(hover: none)').matches;

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


    // board = [[0,0,0,0,0,0,0,0],
    //          [0,0,0,0,0,0,0,0],
    //          [0,0,0,0,0,0,0,0],
    //          [0,0,0,1,2,0,0,0],
    //          [0,0,0,2,1,0,0,0],
    //          [0,0,0,0,0,0,0,0],
    //          [0,0,0,0,0,0,0,0],
    //          [0,0,0,0,0,0,0,0]];

    // board = [[0,0,0,0,0,0,0,0],
    //          [0,0,1,1,0,1,0,0],
    //          [0,0,1,1,1,1,2,2],
    //          [0,0,1,1,1,1,2,2],
    //          [0,0,0,1,1,1,1,2],
    //          [0,0,0,1,1,1,1,2],
    //          [0,0,1,1,0,1,0,2],
    //          [0,0,0,0,0,1,0,0]];
}

const redrawBoard = () => {

    let disks = document.querySelectorAll('.disk');

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {

            disks[r * 8 + c].className = "disk";

            if (board[r][c] == black) disks[r * 8 + c].classList.add("black");
            if (board[r][c] == white) disks[r * 8 + c].classList.add("white");
            if (board[r][c] == gray) disks[r * 8 + c].classList.add("gray");
            if (board[r][c] == blackDot) disks[r * 8 + c].classList.add("black-dot");
            if (board[r][c] == whiteDot) disks[r * 8 + c].classList.add("white-dot");
        }
    }
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

    return [];
}

const checkMove = (board, color, r ,c) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    if (board[r][c] != empty) return false;

    let revesedDisks = [[r, c]];

    for (let dir of dirs) {
        let tempRevesed = [];

        if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == reversedColor) { 
            tempRevesed.push([r + dir[0],c + dir[1]]);
            for (let i = 2; i < 8; i++) {
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == reversedColor) {
                    tempRevesed.push([r + dir[0] * i, c + dir[1] * i]);
                }
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) {
                    revesedDisks  = revesedDisks.concat(tempRevesed);
                    break;
                }
            }
        }
    }

    if (revesedDisks.length != 1) {
        return revesedDisks;
    } else {
        return false;
    }
}

const getValidMove2 = (board, color) => {

    let rows = shuffle([0,1,2,3,4,5,6,7]);
    let columns = shuffle([0,1,2,3,4,5,6,7]);

    for (let row of rows) {

        for (let column of columns) {  
            
            let move = checkMove(board, color, row, column);

            if (move) return move;
        }
    }

    return [];
}

const getValidMoves = (board, color) => {

    let moves = [];

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (validMove(board, color, r, c)) moves.push([r, c]);
        }
    }

    return moves;
}

const squareCoords = (touchedSquare) => {

    let squares = document.querySelectorAll('.square');

    for (let [i, square] of squares.entries()) {
        if (square == touchedSquare) return [Math.floor(i / 8), i % 8];
    }
}

const getFlippedDisks = (board, color, r ,c) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    let revesedDisks = [[r, c]];

    for (let dir of dirs) {
        let tempRevesed = [];

        if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == reversedColor) { 
            tempRevesed.push([r + dir[0],c + dir[1]]);
            for (let i = 2; i < 8; i++) {
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == empty) break;
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == reversedColor) {
                    tempRevesed.push([r + dir[0] * i, c + dir[1] * i]);
                }
                if (validCoords(r + dir[0] * i, c + dir[1] * i) && board[r + dir[0] * i][c + dir[1] * i] == color) {
                    revesedDisks  = revesedDisks.concat(tempRevesed);
                    break;
                }
            }
        }
    }

    return revesedDisks;
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

let difference = (board, color) => {

    let whites = 0;
    let blacks = 0;

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] == white) whites++;
            if (board[r][c] == black) blacks++;
        }
    }

    if (color == black) {
        return 100 * (blacks - whites) / (blacks + whites);
    } else {
        return 100 * (whites - blacks) / (whites + blacks);
    }
}

let mobility = (board, color) => {

    let whiteMoves = getValidMoves(board, white).length;
    let blackMoves = getValidMoves(board, black).length;

    if (whiteMoves + blackMoves == 0) return 0;

    if (color == black) {
        return 100 * (blackMoves - whiteMoves) / (blackMoves + whiteMoves);
    } else {
        return 100 * (whiteMoves - blackMoves) / (blackMoves + whiteMoves);
    }   
}

let corners = (board, color) => {

    let whiteCorners = 0;
    let blackCorners = 0;

    let corners = [[0,0],[0,7],[7,0],[7,7]];

    for (let corner of corners) {
        if (board[corner[0]][corner[1]] == black) blackCorners++;\
        if (board[corner[0]][corner[1]] == white) whiteCorners++;
    }

    if (whiteCorners + blackCorners == 0) return 0;

    if (color == black) {
        return 100 * (blackCorners - whiteCorners) / (blackCorners + whiteCorners);
    } else {
        return 100 * (whiteCorners - blackCorners) / (blackCorners + whiteCorners);
    }
}

let xcsquares = (board, color) => {

    let whiteXCs = 0;
    let blackXCs = 0;

    let corners = [[0,0],[0,7],[7,0],[7,7]];
    let xsquares = [[1,1],[1,6],[6,1],[6,6]];
    let csquares = [[0,1],[0,6],[1,0],[1,7],[6,0],[6,7],[7,1],[7,6]];

    for (let [i, corner] of corners.entries()) {

        if (board[corner[0]][corner[1]] != empty) continue;

        if (board[xsquares[i][0]][xsquares[i][1]] == black) blackXCs++;
        if (board[xsquares[i][0]][xsquares[i][1]] == white) whiteXCs++;

        if (board[csquares[2 * i][0]][csquares[2 * i][1]] == black) blackXCs++;
        if (board[csquares[2 * i + 1][0]][csquares[2 * i + 1][1]] == black) blackXCs++;
        if (board[csquares[2 * i][0]][csquares[2 * i][1]] == white) whiteXCs++;
        if (board[csquares[2 * i + 1][0]][csquares[2 * i + 1][1]] == white) whiteXCs++;    
    }

    if (whiteXCs + blackXCs == 0) return 0;

    if (color == black) {
        return -100 * (blackXCs - whiteXCs) / (blackXCs + whiteXCs);
    } else {
        return -100 * (whiteXCs - blackXCs) / (blackXCs + whiteXCs);
    }
}

let getPotentialMoves = (board, color) => {

    let reversedColor = color == black ? white : black;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
    let moves = 0;

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  

            if (board[r][c] != empty) continue;

            for (let dir of dirs) {
                if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == reversedColor) { 
                    moves++;
                    break;
                }
            }
        }
    }

    return moves;
}

let potentialMobility = (board, color) => {

    let whiteMoves = getPotentialMoves(board, white);
    let blackMoves = getPotentialMoves(board, black);

    if (whiteMoves + blackMoves == 0) return 0;

    if (color == black) {
        return 100 * (blackMoves - whiteMoves) / (blackMoves + whiteMoves);
    } else {
        return 100 * (whiteMoves - blackMoves) / (blackMoves + whiteMoves);
    }   
}

let frontiers = (board, color) => {

    let whites = 0;
    let blacks = 0;
    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) { 
            if (board[r][c] == empty) continue;

            for (let dir of dirs) {
                if (validCoords(r + dir[0], c + dir[1]) && board[r + dir[0]][c + dir[1]] == empty) { 
                    board[r][c] == black ? blacks++ : whites++;
                    break;
                }
            }
        }
    }

    if (whites + blacks == 0) return 0;

    if (color == black) {
        return 100 * (blacks - whites) / (blacks + whites);
    } else {
        return 100 * (whites - blacks) / (blacks + whites);
    }   
}

let getStableDisks = (board, color) => {

    let dirs = [[-1,0],[-1,1],[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1]];
    let corners = [[0,0],[0,7],[7,0],[7,7]];
    let disks = 0;

    for (let corner of corners) {

        if (board[corner[0]][corner[1]] != color) continue;

        disks++;

        for (let dir of dirs) {

            if (validCoords(corner[0] + dir[0], corner[1] + dir[1]) && board[corner[0] + dir[0]][corner[1] + dir[1]] == color) { 

                disks++;

                for (let i = 2; i < 8; i++) {
                    if (validCoords(corner[0] + dir[0] * i, corner[1] + dir[1] * i) && board[corner[0] + dir[0] * i][corner[1] + dir[1] * i] != color) break;
                    disks++;
                }
            }
        }
    }

    return disks;
}

let stability = (board, color) => {

    let whiteDisks = getStableDisks(board, white);
    let blackDisks = getStableDisks(board, black);

    if (whiteDisks + blackDisks == 0) return 0;

    if (color == black) {
        return 100 * (blackDisks - whiteDisks) / (blackDisks + whiteDisks);
    } else {
        return 100 * (whiteDisks - blackDisks) / (blackDisks + whiteDisks);
    }   
}

let edges = (board, color) => {

}

let parity = (board, color) => {

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

let win = (board) => {

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] != black && board[r][c] != white) return false;
        }
    }
    return true;
} 

const randomAI = () => {

    let moves = getValidMoves(board, color);

    return moves[Math.floor(Math.random() * moves.length)];
}

const aiTurn = () => {

    let move, move2;
    let startTime = new Date();

    let depth = 4;

    // clearHints();

    // redrawBoard();

    if (color == black) {
        move = monteCarlo2(board, startTime, color, 2000);

        // [move, score] = minimax(board, depth, -Infinity, Infinity, true);



        // move = evristik(board, color);


        // console.log(move);

    } else {
        // move = randomAI();
        // move = evristik(board, color);

        move = monteCarlo2(board, startTime, color, 20000);


    }

    // console.log("DONE");



    try {

        // await new Promise(p => setTimeout(p, 2000));

        let reversedDisks = getFlippedDisks(board, color, move[0], move[1]);

        reversedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

        let board1 = board.map(arr => arr.slice());
        console.log(board1);

        reverseColor();

        setHints(getValidMoves(board, color));

        board[reversedDisks[0][0]][reversedDisks[0][1]] *= -1;

        draw = false;

    } catch {
        console.log("PASS: ", color);
        if (draw) {
            if (winner(board)[0] == 1) statWin[0]++;
            if (winner(board)[0] == 2) statWin[1]++;
            console.log(winner(board), statWin);
             setTimeout(init, 2000);
             return;
        }
    
        draw = true;
        reverseColor();
        setHints(getValidMoves(board, color));
    };

    redrawBoard();
    clearHints();

    if (win(board)) {
        if (winner(board)[0] == 1) statWin[0]++;
        if (winner(board)[0] == 2) statWin[1]++;
        console.log(winner(board), statWin);
        redrawBoard();
        setTimeout(init, 2000);
        return;
    };

    if (getValidMoves(board, color).length == 0) {
        console.log("PASS: ", color);
        if (draw) {
            if (winner(board)[0] == 1) statWin[0]++;
            if (winner(board)[0] == 2) statWin[1]++;
            console.log(winner(board), statWin);
            setTimeout(init, 2000);
            return;
        }

        draw = true;
        reverseColor();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn();
            });
        }); 
    } else {
        draw = false;
        // setHints(getValidMoves(board, color));
        // redrawBoard();


        enableTouch();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn();
            });
        }); 
    }
}

const humanTurn = (e) => {  
    
    let square = e.currentTarget;
    let [r, c] = squareCoords(square);

    clearHints();

    if (!validMove(board, color, r, c)) return;

    disableTouch();

    let reversedDisks = getFlippedDisks(board, color, r, c);

    reversedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

    board[reversedDisks[0][0]][reversedDisks[0][1]] *= -1;

    let board1 = board.map(arr => arr.slice());
    console.log(board1);

    redrawBoard();

    clearHints();

    reverseColor();

    if (win(board)) {
        console.log(winner(board))
        // redrawBoard();
    } else {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn();
            });
        });  
    }
}

const monteCarlo = (board, startTime, initialColor, timeLimit) => {

    let move, color, firstMove, tempBoard, reversedDisks, validMoves;
    let bestSquare, bestValue;
    let pass;
    let stats = Array.from(Array(64), _ => Array(2).fill(0));
    let i = 0;
    let revercedColor = initialColor == black ? white : black;

    if (getValidMoves(board, initialColor).length == 0) return undefined;

    do {
        i++

        tempBoard = board.map(arr => arr.slice());
        color = initialColor;
        firstMove = null;
        pass = false;
        
        do{

            validMoves = getValidMoves(tempBoard, color);

            if (validMoves.length != 0) {

                pass = false;

                move = validMoves[Math.floor(Math.random() * validMoves.length)];

                if (firstMove == null) firstMove = move[0] * 8 + move[1];

                reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);

                reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

                color = color == black ? white : black;

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(move[0], move[1], firstMove);

                // console.log(board1);

                // break;
            } 
            
            if (validMoves.length == 0 && !pass){

                pass = true;
                color = color == black ? white : black;
                continue;
    
            }

            if (win(tempBoard) || pass) {

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(board1);

                // console.log(new Date() - startTime);

                // console.log(winner(tempBoard));

                let result = winner(tempBoard)[0];

                stats[firstMove][1]++;

                if (!result) break;

                if (result == initialColor) {
                    stats[firstMove][0]++;
                } else {
                    stats[firstMove][0]--;
                }

                break;
            }  
                    
        } while(true);

    } while (!timeOver(startTime, timeLimit));

    console.log(i, initialColor);


    let stats1 = stats.map(arr => arr.slice());

    console.log(stats1);


    bestValue = -Infinity    

    for (let [i, s] of stats.entries()) {

        if (s[1] == 0) continue;
        if (s[0] / s[1] > bestValue) [bestValue, bestSquare] = [s[0] / s[1], i]

    }

    return [Math.floor(bestSquare / 8), bestSquare % 8];
}

const monteCarlo2 = (board, startTime, initialColor, timeLimit) => {

    let move, color, firstMove, tempBoard, reversedDisks, validMoves;
    let bestSquare, bestValue;
    let pass;
    let stats = Array.from(Array(64), _ => Array(2).fill(0));
    let i = 0;
    let revercedColor = initialColor == black ? white : black;

    if (getValidMoves(board, initialColor).length == 0) return undefined;

    do {
        i++

        tempBoard = board.map(arr => arr.slice());
        color = initialColor;
        firstMove = null;
        pass = false;
        
        do{

            move = getValidMove(tempBoard, color);

            if (move.length != 0) {

                pass = false;

                if (firstMove == null) firstMove = move[0] * 8 + move[1];

                reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);

                reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

                color = color == black ? white : black;

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(move[0], move[1], firstMove);

                // console.log(board1);

                // break;
            } 
            
            if (move.length == 0 && !pass){

                pass = true;
                color = color == black ? white : black;
                continue;
    
            }

            if (win(tempBoard) || pass) {

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(board1);

                // console.log(new Date() - startTime);

                // console.log(winner(tempBoard));

                let result = winner(tempBoard)[0];

                stats[firstMove][1]++;

                if (!result) break;

                if (result == initialColor) {
                    stats[firstMove][0]++;
                } else {
                    stats[firstMove][0]--;
                }

                break;
            }  
                    
        } while(true);

    } while (!timeOver(startTime, timeLimit));

    console.log(i, initialColor);


    let stats1 = stats.map(arr => arr.slice());

    console.log(stats1);

    bestValue = -Infinity    

    for (let [i, s] of stats.entries()) {

        if (s[1] == 0) continue;
        if (s[0] / s[1] > bestValue) [bestValue, bestSquare] = [s[0] / s[1], i]

    }

    return [Math.floor(bestSquare / 8), bestSquare % 8];
}

const monteCarlo4 = (board, startTime, initialColor) => {

    let move, color, firstMove, tempBoard, reversedDisks, validMoves;
    let bestSquare, bestValue;
    let pass;
    let stats = Array.from(Array(64), _ => Array(2).fill(0));
    let i = 0;
    let revercedColor = initialColor == black ? white : black;

    if (getValidMoves(board, initialColor).length == 0) return undefined;

    do {
        i++

        tempBoard = board.map(arr => arr.slice());
        color = initialColor;
        firstMove = null;
        pass = false;
        
        do{

            move = getValidMove(tempBoard, color);

            if (move.length != 0) {

                pass = false;

                if (firstMove == null) firstMove = move[0] * 8 + move[1];

                reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);

                reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

                color = color == black ? white : black;

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(move[0], move[1], firstMove);

                // console.log(board1);

                // break;
            } 
            
            if (move.length == 0 && !pass){

                pass = true;
                color = color == black ? white : black;
                continue;
    
            }

            if (win(tempBoard) || pass) {

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(board1);

                // console.log(new Date() - startTime);

                // console.log(winner(tempBoard));

                let result = winner(tempBoard);

                stats[firstMove][1]++;

                if (!result[0]) break;

                if (result[0] == initialColor) {
                    stats[firstMove][0] += 1 * Math.abs(result[1] - result[1] / 64);
                } else {
                    stats[firstMove][0] -= 1 * Math.abs(result[1] - result[1] / 64);
                }

                break;
            }  
                    
        } while(true);

    } while (!timeOver(startTime));

    console.log(i, initialColor);


    let stats1 = stats.map(arr => arr.slice());

    console.log(stats1);

    bestValue = -Infinity    

    for (let [i, s] of stats.entries()) {

        if (s[1] == 0) continue;
        if (s[0] / s[1] > bestValue) [bestValue, bestSquare] = [s[0] / s[1], i]

    }

    return [Math.floor(bestSquare / 8), bestSquare % 8];
}

const monteCarlo3 = (board, startTime, initialColor) => {

    let move, color, firstMove, tempBoard, reversedDisks, validMoves;
    let bestSquare, bestValue;
    let pass;
    let stats = Array.from(Array(64), _ => Array(2).fill(0));
    let i = 0;
    let revercedColor = initialColor == black ? white : black;

    if (getValidMoves(board, initialColor).length == 0) return undefined;

    do {
        i++

        tempBoard = board.map(arr => arr.slice());
        color = initialColor;
        firstMove = null;
        pass = false;
        
        do{

            move = getValidMove2(tempBoard, color);

            if (move.length != 0) {

                pass = false;

                if (firstMove == null) firstMove = move[0][0] * 8 + move[0][1];

                // move = getFlippedDisks(tempBoard, color, move[0], move[1]);

                move.forEach(disk => tempBoard[disk[0]][disk[1]] = color);


                // reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

                color = color == black ? white : black;

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(move[0], move[1], firstMove);

                // console.log(board1);

                // break;
            } 
            
            if (move.length == 0 && !pass){

                pass = true;
                color = color == black ? white : black;
                continue;
    
            }

            if (win(tempBoard) || pass) {

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(board1);

                // console.log(new Date() - startTime);

                // console.log(winner(tempBoard));

                let result = winner(tempBoard)[0];

                stats[firstMove][1]++;

                if (!result) break;

                if (result == initialColor) {
                    stats[firstMove][0]++;
                } else {
                    stats[firstMove][0]--;
                }

                break;
            }  
                    
        } while(true);

    } while (!timeOver(startTime));

    console.log(i, initialColor);


    let stats1 = stats.map(arr => arr.slice());

    console.log(stats1);

    bestValue = -Infinity    

    for (let [i, s] of stats.entries()) {

        if (s[1] == 0) continue;
        if (s[0] / s[1] > bestValue) [bestValue, bestSquare] = [s[0] / s[1], i]

    }

    return [Math.floor(bestSquare / 8), bestSquare % 8];
}

const terminalNode = (board) => {

    let revercedColor = color == black ? white : black;
    
    return win(board) || (getValidMoves(board, color) == 0 && getValidMoves(board, revercedColor) == 0);
}

const minimax = (board, depth, alpha, beta, maximizingPlayer) => {

    let tempBoard;
    let revercedColor = color == black ? white : black;
    // let color = maximizingPlayer ? color : revercedColor;

    let validMoves = getValidMoves(board, color);

    let validMovesOpponent = getValidMoves(board, revercedColor);

    // let opponent = maximizingPlayer ? false : true;

    if (depth == 0 || win(board) || (validMoves.length == 0 && validMovesOpponent.length == 0)) return [null, evaluation(board, color)];

    // if (timeOut(startTime)) return [null, null];
    // if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];

    if (maximizingPlayer && validMoves.length == 0) return minimax(board, depth - 1, alpha, beta, false);
    if (!maximizingPlayer && validMovesOpponent.length == 0) return minimax(board, depth - 1, alpha, beta, true);

    if (maximizingPlayer) {

        let bestMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        let bestScore = -Infinity;

        for (let move of validMoves) {

            tempBoard = board.map(arr => arr.slice());
    
            reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);
            reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);
            
            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, false);

            if (score > bestScore) [bestScore, bestMove] = [score, move];

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;
        }
         
        return [bestMove, bestScore];

    } else {
        
        let bestMove = validMovesOpponent[Math.floor(Math.random() * validMovesOpponent.length)];
        let bestScore = Infinity;

        for (let move of validMoves) {

            tempBoard = board.map(arr => arr.slice());
    
            reversedDisks = getFlippedDisks(tempBoard, revercedColor, move[0], move[1]);
            reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = revercedColor);

            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, true);
    
            if (score < bestScore) [bestScore, bestMove] = [score, move];

            beta = Math.min(beta, score);

            if (beta <= alpha) break;
        }
        return [bestMove, bestScore];
    }
}

const matrixEval = (board, color) => {

    let score = 0;
    let revercedColor = color == black ? white : black;

    const matrix = [[16.16, -3.03, 0.99, 0.43, 0.43, 0.99, -3.03, 16.16], 
                    [-4.12, -1.81, -0.08, -0.27, -0.27, -0.08, -1.81, -4.12],
                    [1.33, -0.04, 0.51, 0.07, 0.07, 0.51, -0.04, 1.33], 
                    [0.63, -0.18, -0.04, -0.01, -0.01, -0.04, -0.18, 0.63],
                    [0.63, -0.18, -0.04, -0.01, -0.01, -0.04, -0.18, 0.63],
                    [1.33, -0.04, 0.51, 0.07, 0.07, 0.51, -0.04, 1.33],
                    [-4.12, -1.81, -0.08, -0.27, -0.27, -0.08, -1.81, -4.12],
                    [16.16, -3.03, 0.99, 0.43, 0.43, 0.99, -3.03, 16.16]];

                   
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            if (board[r][c] == color) score += matrix[r][c];
            if (board[r][c] == revercedColor) score -= matrix[r][c];
        }
    }

    return score;
}

const evaluation = (board, color) => {

    let score = 0;
    
    score = 25 * difference(board, color) + 30 * corners(board, color) + 5 * mobility(board, color) + 5 * potentialMobility(board, color) + 25 * stability(board, color);



    // score = matrixEval(board, color);


    return score;
}

const evristik = (board, color) => {

    let tempBoard;
    let score;

    let validMoves = getValidMoves(board, color);

    if (validMoves.length == 0) return undefined;

    let bestScore = -Infinity;
    let bestMove = [];

    for (let move of validMoves) {

        tempBoard = board.map(arr => arr.slice());

        reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);

        reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

        score = evaluation(tempBoard, color);

        if (score > bestScore) [bestScore, bestMove] = [score, move];
    }

    return bestMove;
}


const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
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

    // setTimeout(enableTouch, 1000);
}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
