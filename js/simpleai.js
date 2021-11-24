const randomAI = () => {

    let moves = getValidMoves(board, color);

    return moves[Math.floor(Math.random() * moves.length)];
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