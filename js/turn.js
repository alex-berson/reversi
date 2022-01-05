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

const aiTurn = (n) => {

    let startTime = new Date();
    let move;
    n = 0;

    if (color == black) {

        // move = monteCarlo(board, startTime, color, 2000);

        move = mcts(board, color, startTime, Math.max(500, n * 200 + 400 + 1000));


        // move = randomAI();

        // [move, score] = minimax(board, depth, -Infinity, Infinity, true);

        // move = evristik(board, color);

        // console.log(move);

    } else {
        // move = randomAI();
        // move = evristik(board, color);

        move = mcts(board, color, startTime, Math.max(500, n * 200 + 400 + 1000));

        // move = monteCarlo2(board, startTime, color, 2000);

    }

    if (move == null) {
        console.log("PASS: ", color);
        reverseColor();

        if (getValidMoves(board, color).length == 0) {
            console.log("PASS: ", color);
            printStat();
            setTimeout(gameOver, 1000);
            // setTimeout(rePlay, Math.max(2000, n * 200 + 400 + 2000));  //
            return;
        }

        showHints(getValidMoves(board, color)); //

        setTimeout(enableTouch, 0);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // setTimeout(aiTurn, 100, 0); //
            });
        });  

        return;
    }

    let disks = makeMove(board, color, move[0], move[1]);

    setTimeout(flipDisks, 0, disks, color);

    // flipDisks(disks);

    printBoard();
    reverseColor();;

    if (getValidMoves(board, color).length == 0) {
        console.log("PASS: ", color);
        reverseColor();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 100, distance(disks));
            });
        }); 
        return;
    }

    // let validMoves = getValidMoves(board, color);

    setTimeout(() => {
        showHints(getValidMoves(board, color)); //
        enableTouch();
    // }, 400 + distance(disks) * 200 + 100);
    }, 1000);


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

    disableTouch();

    hideHints();

    let disks = makeMove(board, color, r, c);

    flipDisks(disks, color);

    printBoard();

    reverseColor();

    if (terminal(board)) {
        console.log(winner(board))
        printStat();
        setTimeout(gameOver, 1000);
    } else {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 0, distance(disks));
                // aiTurn();
            });
        });  
    }
}