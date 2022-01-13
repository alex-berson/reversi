const monteCarlo = (board, startTime, initialColor, timeLimit) => {

    let bestSquare, bestValue, firstMove;
    let pass;
    let stats = Array.from(Array(64), _ => Array(2).fill(0));
    let i = 0;

    if (getValidMoves(board, initialColor).length == 0) return null;

    do {
        i++;

        let tempBoard = board.map(arr => arr.slice());
        let color = initialColor;
        firstMove = null;
        pass = false;
        
        do {

            let moves = getValidMoves(tempBoard, color);

            if (moves.length != 0) {

                pass = false;

                let move = moves[Math.floor(Math.random() * moves.length)];

                if (firstMove == undefined) firstMove = move[0] * 8 + move[1];

                makeMove(tempBoard, color, move[0], move[1]);


                // let reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);
                // reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

                color = color == black ? white : black;

            } 
            
            if (moves.length == 0 && !pass){

                pass = true;
                color = color == black ? white : black;
                continue;
    
            }

            if (boardFull(tempBoard) || pass) {

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

const monteCarlo2 = (board, initialColor, startTime, timeLimit) => {

    let move, color, firstMove, tempBoard, reversedDisks, validMoves;
    let bestSquare, bestValue;
    let pass;
    let stats = Array.from(Array(64), _ => Array(2).fill(0));
    let i = 0;
    let revercedColor = initialColor == black ? white : black;

    if (getValidMoves(board, initialColor).length == 0) return null;

    do {
        i++

        tempBoard = board.map(arr => arr.slice());
        color = initialColor;
        firstMove = null;
        pass = false;
        
        do{

            move = getValidMove(tempBoard, color);

            if (move != null) {

                pass = false;

                if (firstMove == null) firstMove = move[0] * 8 + move[1];

                let reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);

                reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

                color = color == black ? white : black;

                // let board1 = tempBoard.map(arr => arr.slice());

                // console.log(move[0], move[1], firstMove);

                // console.log(board1);

                // break;
            } 
            
            if (move == null && !pass){

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