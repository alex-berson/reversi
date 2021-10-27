let board = [];
let empty = 0;
let black = 1;
let white = 2;
let gray = 100;
let blackDot = -1;
let whiteDot = -2;
let draw = false;
let timeLimit = 2000;

let color = black;

const showBoard = () => document.querySelector("body").style.opacity = 1;

const resetBoard = () => board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

const touchScreen = () => matchMedia('(hover: none)').matches;

const timeOver = (startTime) => new Date() - startTime >= timeLimit;

// const pause = (m) => await new Promise(r => setTimeout(r, m));


const reverseColor = () => color = color == black ? white : black;

const setBoard = () => {

    board = [[0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,2,1,0,0,0],
             [0,0,0,1,2,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0]];

    // board = [[0,1,1,1,1,0,2,1],
    //          [0,2,2,2,2,2,0,1],
    //          [2,2,2,2,2,2,2,1],
    //          [2,2,2,2,2,2,2,1],
    //          [2,2,2,2,2,2,2,1],
    //          [2,2,2,2,2,2,2,1],
    //          [2,2,2,2,2,2,2,1],
    //          [0,2,2,2,2,2,0,0]];
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

const getValidMoves = (board, color) => {

    let moves = [];

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (validMove(board, color, r, c)) moves.push([r, c]);
        }
    }

    return moves;
}

const setHints = (moves) => {
    for (let move of moves) {
        board[move[0]][move[1]] = gray;
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

const clearHints = () => {
    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] == gray) board[r][c] = 0;
            if (board[r][c] == blackDot) board[r][c] = black;
            if (board[r][c] == whiteDot) board[r][c] = white;
        }
    }
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

    
}

let potential = (board, color) => {


}

let edges = (board, color) => {


}

let stability = (board, color) => {


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

    let startTime = new Date();

    // clearHints();

    // redrawBoard();

    let move = monteCarlo(board, startTime, color);

    // let move = randomAI();

    try {

        // await new Promise(p => setTimeout(p, 2000));

        let reversedDisks = getFlippedDisks(board, color, move[0], move[1]);

        reversedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

        reverseColor();

        setHints(getValidMoves(board, color));

        board[reversedDisks[0][0]][reversedDisks[0][1]] *= -1;

        draw = false;

    } catch {
        console.log("PASS AI");
        if (draw) {console.log(winner(board)); return}
        draw = true;
    };

    redrawBoard();
    clearHints();

    if (win(board)) {console.log(winner(board)); redrawBoard(); return};



    if (getValidMoves(board, color).length == 0) {
        console.log("PASS HUMAN");
        if (draw) {console.log(winner(board)); return;}
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

    console.log(board);

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

const monteCarlo = (board, startTime, initialColor) => {

    let move, color, firstMove, tempBoard, reversedDisks, validMoves;
    let bestSquare, bestValue;
    let draw;
    let stats = Array.from(Array(64), _ => Array(2).fill(0));
    let i = 0;
    let revercedColor = initialColor == black ? white : black;

    do {
        i++

        tempBoard = board.map(arr => arr.slice());
        color = initialColor;
        firstMove = null;
        draw = false;
        
        do{

            validMoves = getValidMoves(tempBoard, color);

            if (validMoves.length != 0) {

                draw = false;

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
            
            if (validMoves.length == 0 && !draw){

                draw = true;
                color = color == black ? white : black;
                continue;
    
            }

            if (win(tempBoard) || draw) {

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

    disableTapZoom();

    setBoard();

    // redrawBoard();

    setBoardSize();
    
    showBoard();

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
