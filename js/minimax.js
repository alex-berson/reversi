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