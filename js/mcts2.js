let win = (board) => {

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {  
            if (board[r][c] != black && board[r][c] != white) return false;
        }
    }
    return true;
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

setupTree2 = (board, initialColor) => {

    let revercedColor = initialColor == black ? white : black;

    let tree = {};

    tree.board = board.map(arr => arr.slice());
    tree.parent = null;
    tree.color = revercedColor;
    tree.plays = Number.MIN_VALUE;
    tree.wins = 0;
    tree.children = [];

    let moves = shuffle(getValidMoves(board, initialColor));

    for (let move of moves) {

        let tempBoard = board.map(arr => arr.slice());

        let reversedDisks = getFlippedDisks(tempBoard, initialColor, move[0], move[1]);
        reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = initialColor);

        tree.children.push({});

        tree.children[tree.children.length - 1].board = tempBoard;
        tree.children[tree.children.length - 1].move = move;
        tree.children[tree.children.length - 1].parent = tree;
        tree.children[tree.children.length - 1].color = initialColor;
        tree.children[tree.children.length - 1].plays = Number.MIN_VALUE;
        tree.children[tree.children.length - 1].wins = 0;
        tree.children[tree.children.length - 1].children = [];
    }

    return tree;
}

const selection2 = (tree) => {

    let node = tree;

    while (node.children.length) {

            let maxChild;
            let maxUCB1 = -Infinity;
    
            for (let child of node.children) {
    
                let ucb1 = child.wins / child.plays + 1.5 * Math.sqrt(Math.abs(Math.log(child.parent.plays)) / child.plays);
    
                if (ucb1 > maxUCB1) [maxChild, maxUCB1] = [child, ucb1];
            } 

            node = maxChild;
    }

    return node;
}

const expansion2 = (node) => {

    let color = node.color == black ? white : black;
    let moves = shuffle(getValidMoves(node.board, color));

    if (moves.length == 0) {
        moves = shuffle(getValidMoves(node.board, node.color));
        if (moves.length == 0) return node;
        color = node.color;
    }

    for (let move of moves) {

        let tempBoard = node.board.map(arr => arr.slice());

        let reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);
        reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

        node.children.push({});

        node.children[node.children.length - 1].board = tempBoard;
        node.children[node.children.length - 1].parent = node;
        node.children[node.children.length - 1].color = color;
        node.children[node.children.length - 1].plays = Number.MIN_VALUE;
        node.children[node.children.length - 1].wins = 0;
        node.children[node.children.length - 1].children = [];
    }

    return node.children[0];
}

const simulation2 = (node) => {

    let pass = false;
    let color = node.color == black ? white : black;
    let tempBoard = node.board.map(arr => arr.slice());

    do {

        let moves = getValidMoves(tempBoard, color);

        // let moves = getValidMove(tempBoard, color);


        if (moves.length != 0) {
            pass = false;
            let move = moves[Math.floor(Math.random() * moves.length)];
            // let move = moves;

            reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);
            reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);
            color = color == black ? white : black;
        } 
        
        if (moves.length == 0 && !pass){
            pass = true;
            color = color == black ? white : black;
            continue;
        }

        if (win(tempBoard) || pass) return winner(tempBoard)[0];
                
    } while(true);

}

backprapogation2 = (node, color) => {

    do {
        node.plays++;
        if (node.color == color) node.wins++;
        node = node.parent;
    } while (node != null)
} 

const mcts2 = (board, startTime, initialColor, timeLimit) => {

    if (getValidMoves(board, initialColor).length == 0) return undefined;

    let tree = setupTree2(board, initialColor);

    let i = 0;

    do {

        i++;

        let node = selection2(tree);

        if (node.plays != Number.MIN_VALUE) node = expansion2(node);

        let winner = simulation2(node);

        backprapogation2(node, winner);

    } while (!timeOver(startTime, timeLimit));

    console.log(i, initialColor);

    let bestMove;
    let bestValue = -Infinity;

    for (child of tree.children) {

        let value = child.wins / child.plays;

        if (value > bestValue) [bestValue, bestMove] = [value, child.move];
    }

    return bestMove;
}