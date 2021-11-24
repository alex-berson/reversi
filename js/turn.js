// const showMove = (r, c) => {
//     board[r][c] *= -1;
// }

const printBoard = () => {

    let newBoard = board.map(arr => arr.slice());
        
    console.log(newBoard);
}

const printStat = () => {

    if (winner(board)[0] == 1) statWin[0]++;
    if (winner(board)[0] == 2) statWin[1]++;
    console.log(winner(board), statWin);

}

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

//     if (full(board)) {
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

const aiTurn = () => {

    let startTime = new Date();
    let move;

    // if (terminal(board)) {
    //     printStat();
    //     setTimeout(init, 2000);
    //     return;
    // }

    if (color == black) {

        move = monteCarlo(board, startTime, color, 2000);

        // move = randomAI();

        // [move, score] = minimax(board, depth, -Infinity, Infinity, true);

        // move = evristik(board, color);

        // console.log(move);

    } else {
        // move = randomAI();
        // move = evristik(board, color);

        move = mcts(board, startTime, color, 2000);

        // move = monteCarlo2(board, startTime, color, 1000);

    }

    if (move == null) {
        console.log("PASS: ", color);
        reverseColor();

        if (getValidMoves(board, color).length == 0) {
            console.log("PASS: ", color);
            printStat();
            // setTimeout(init, 2000);  //
            return;
        }

        // showHints(getValidMoves(board, color));

        // setHints(getValidMoves(board, color));
        // redrawBoard();

        showHints(getValidMoves(board, color));

        enableTouch();

        // requestAnimationFrame(() => {
        //     requestAnimationFrame(() => {
        //         setTimeout(aiTurn, 0); //
        //     });
        // });  

        return;
    }

    let disks = makeMove(board, color, move[0], move[1]);

    flipDisks(disks);

    printBoard();
    reverseColor();

    // setHints(getValidMoves(board, color));
    // showMove(move[0], move[1]);
    // redrawBoard();
    // clearHints();

    if (getValidMoves(board, color).length == 0) {
        console.log("PASS: ", color);
        reverseColor();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 0);
            });
        }); 
        return;
    }

    showHints(getValidMoves(board, color));

    enableTouch();

    // requestAnimationFrame(() => {
    //     requestAnimationFrame(() => {
    //         setTimeout(aiTurn, 0); //
    //     });
    // });  
}

const humanTurn = (e) => {  

    console.log("TOUCH");
    
    let square = e.currentTarget;
    let [r, c] = squareCoords(square);

    // clearHints();

    if (!validMove(board, color, r, c)) return;

    disableTouch();

    hideHints();

    let disks = makeMove(board, color, r, c);

    flipDisks(disks);

    // showMove(r, c);

    printBoard();

    // redrawBoard();

    // clearHints();

    reverseColor();

    if (terminal(board)) {
        console.log(winner(board))
        // redrawBoard();
    } else {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setTimeout(aiTurn, 100);
            });
        });  
    }
}