const aiTurn = () => {

    let move;
    let startTime = new Date();

    let depth = 4;

    // clearHints();

    // redrawBoard();

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

        // move = monteCarlo2(board, startTime, color, 2000);


    }

    // console.log("DONE");



    if (move) {

        // await new Promise(p => setTimeout(p, 2000));

        makeMove(board, color, move[0], move[1]);


        // let reversedDisks = getFlippedDisks(board, color, move[0], move[1]);

        // reversedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

        let board1 = board.map(arr => arr.slice());
        console.log(board1);

        reverseColor();

        setHints(getValidMoves(board, color));

        board[move[0]][move[1]] *= -1;

        pass = false;

    } else {
        console.log("PASS: ", color);
        if (pass) {
            if (winner(board)[0] == 1) statWin[0]++;
            if (winner(board)[0] == 2) statWin[1]++;
            console.log(winner(board), statWin);
             setTimeout(init, 2000);
             return;
        }
    
        pass = true;
        reverseColor();
        setHints(getValidMoves(board, color));
    };

    redrawBoard();
    clearHints();

    if (full(board)) {
        if (winner(board)[0] == 1) statWin[0]++;
        if (winner(board)[0] == 2) statWin[1]++;
        console.log(winner(board), statWin);
        redrawBoard();
        setTimeout(init, 2000);
        return;
    };

    if (getValidMoves(board, color).length == 0) {
        console.log("PASS: ", color);
        if (pass) {
            if (winner(board)[0] == 1) statWin[0]++;
            if (winner(board)[0] == 2) statWin[1]++;
            console.log(winner(board), statWin);
            setTimeout(init, 2000);
            return;
        }

        pass = true;
        reverseColor();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn();
            });
        }); 
    } else {
        pass = false;
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

    makeMove(board, color, r, c);

    // let reversedDisks = getFlippedDisks(board, color, r, c);

    // reversedDisks.forEach(disk => board[disk[0]][disk[1]] = color);

    board[r][c] *= -1;

    let board1 = board.map(arr => arr.slice());
    console.log(board1);

    redrawBoard();

    clearHints();

    reverseColor();

    if (full(board)) {
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