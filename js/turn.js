
// const showMove = (r, c) => {
//     board[r][c] *= -1;
// }

// const aiTurn = () => {

//     let move;
//     let startTime = new Date();

//     let depth = 4;

//     // clearHints();

//     // redrawBoard();

//     if (color == black) {

//         move = monteCarlo(board, startTime, color, 2000);

//         // move = randomAI();

//         // [move, score] = minimax(board, depth, -Infinity, Infinity, true);

//         // move = evristik(board, color);

//         // console.log(move);

//     } else {
//         // move = randomAI();
//         // move = evristik(board, color);

//         move = mcts(board, startTime, color, 2000);

//         // move = monteCarlo2(board, startTime, color, 2000);

//     }


//     if (move) {

//         // await new Promise(p => setTimeout(p, 2000));

//         makeMove(board, color, move[0], move[1]);


//         // let reversedDisks = getFlippedDisks(board, color, move[0], move[1]);

//         // reversedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

//         printBoard();

//         reverseColor();

//         setHints(getValidMoves(board, color));

//         showMove(move[0], move[1]);

//         pass = false;

//     } else {
//         console.log("PASS: ", color);
//         if (pass) {
//              printStat();
//              setTimeout(init, 2000);
//              return;
//         }
    
//         pass = true;
//         reverseColor();
//         setHints(getValidMoves(board, color));
//     };

//     redrawBoard();
//     clearHints();

//     if (boardFull(board)) {
//         printStat();
//         redrawBoard();
//         setTimeout(init, 2000);
//         return;
//     };

//     if (getValidMoves(board, color).length == 0) {
//         console.log("PASS: ", color);
//         if (pass) {
//             printStat();
//             setTimeout(init, 2000);
//             return;
//         }

//         pass = true;
//         reverseColor();
//         requestAnimationFrame(() => {
//             requestAnimationFrame(() => {
//                 aiTurn();
//             });
//         }); 
//     } else {
//         pass = false;
//         // setHints(getValidMoves(board, color));
//         // redrawBoard();


//         enableTouch();

//         // requestAnimationFrame(() => {
//         //     requestAnimationFrame(() => {
//         //         aiTurn();
//         //     });
//         // }); 
//     }
// }

// const checkMove = () => {

//     let disks = document.querySelectorAll('.disk');

//     for (let i = 0; i < 64; i++) {

//         if (disks[i].classList.contains("black") && board[Math.floor(i / 8)][i % 8] != 1) {

//             console.log(Math.floor(i / 8), i % 8);

//             return true;
//         };

//         if (disks[i].classList.contains("white") && board[Math.floor(i / 8)][i % 8] != 2) {

//             console.log(Math.floor(i / 8), i % 8);
            
//             return true;
//         }

//     }
//     return false;
// }

const aiTurn = (n) => {

    let startTime = new Date();
    let move;
    n = 0;

    let depth = 10;

    if (color == black) {

        // move = monteCarlo(board, startTime, color, 2000);

        // move = monteCarlo2(board, color, startTime, 1500);

        // startTime = new Date();


        move = mcts(board, color, startTime, Math.max(1500, n * 200 + 400 + 1000));


        // move = randomAI();

        // [move, score] = minimax(board, depth, -Infinity, Infinity, true);

        // move = evristik(board, color);

        // console.log(move);

        if (move != null ) moves.push(move[0] * 8 + move[1]);

        // console.log(moves);

        // if (move != null) {
        //     let el = moves2.shift();
        //     move = [Math.floor(el / 8), el % 8];
        // }

    } else {

        // move = randomAI();
        // move = evristik(board, color);

        // move = monteCarlo2(board, color, startTime, 1500);

        // startTime = new Date();

        // [move, score] = minimax(board, depth, -Infinity, Infinity, true);


        move = mcts(board, color, startTime, Math.max(1500, n * 200 + 400 + 1000));


        if (move != null ) moves.push(move[0] * 8 + move[1]);

        // console.log(moves);

        // if (move != null) {
        //     let el = moves2.shift();
        //     move = [Math.floor(el / 8), el % 8];
        // }

    }

    // if (checkMove()) return;

    if (move == null) {
        // console.log("PASS: ", color);
        reverseColor();

        if (getValidMoves(board, color).length == 0) {
            // console.log("PASS: ", color);
            printStat();        //
            setTimeout(gameOver, 1000);
            // setTimeout(rePlay, Math.max(2000, n * 200 + 400 + 2000));  //
            return;
        }

        showHints(getValidMoves(board, color));     //

        setTimeout(enableTouch, 0);

        // requestAnimationFrame(() => {
        //     requestAnimationFrame(() => {
        //         setTimeout(aiTurn, 50, 0); //
        //     });
        // });  

        return;
    }


    let disks = makeMove(board, color, move[0], move[1]);

    setTimeout(flipDisks, 20, disks, color);

    // flipDisks(disks);

    printBoard();
    reverseColor();

    if (getValidMoves(board, color).length == 0) {
        // console.log("PASS: ", color);
        reverseColor();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 50, distance(disks));
            });
        }); 
        return;
    }

    // let validMoves = getValidMoves(board, color);

    setTimeout(() => {
        showHints(getValidMoves(board, color)); //
        enableTouch();
    // }, 400 + distance(disks) * 200 + 100);
    }, 1100);


    // setTimeout(showHints, 2000, validMoves);

    // showHints(getValidMoves(board, color));

    // setTimeout(enableTouch, 0);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            // setTimeout(aiTurn, 100, distance(disks)); //
        });
    });  
}

const humanTurn = (e) => {  

    let square = e.currentTarget;
    let [r, c] = squareCoords(square);

    if (!validMove(board, color, r, c)) return;

    let disks = makeMove(board, color, r, c);

    disableTouch();

    hideHints();

    flipDisks(disks, color);

    printBoard();

    reverseColor();

    if (terminal(board)) {
        console.log(winner(board))
        printStat();    //
        setTimeout(gameOver, 1000);
    } else {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 0, distance(disks));
            });
        });  
    }
}
