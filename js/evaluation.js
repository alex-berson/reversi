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
        if (board[corner[0]][corner[1]] == black) blackCorners++;
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


    // score = difference(board, color);
    // score = matrixEval(board, color);


    return score;
}