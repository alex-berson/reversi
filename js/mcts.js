const nodeSetUp = (node, move, color) => {

    let tempBoard = node.board.map(arr => arr.slice());

    makeMove(tempBoard, color, move[0], move[1]);

    // let flippedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);
    // flippedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

    node.children.push({});
    
    let n = node.children.length - 1;

    node.children[n].board = tempBoard;
    node.children[n].move = move;
    node.children[n].parent = node;
    node.children[n].color = color;
    node.children[n].plays = Number.MIN_VALUE;
    node.children[n].wins = 0;
    node.children[n].children = [];
} 

const setupTree = (board, initialColor) => {

    let color = initialColor;
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

        nodeSetUp(tree, move, color);


        // let tempBoard = board.map(arr => arr.slice());

        // let reversedDisks = getFlippedDisks(tempBoard, initialColor, move[0], move[1]);
        // // reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = initialColor);

        // tree.children.push({});

        // tree.children[tree.children.length - 1].board = tempBoard;
        // tree.children[tree.children.length - 1].move = move;
        // tree.children[tree.children.length - 1].parent = tree;
        // tree.children[tree.children.length - 1].color = initialColor;
        // tree.children[tree.children.length - 1].plays = Number.MIN_VALUE;
        // tree.children[tree.children.length - 1].wins = 0;
        // tree.children[tree.children.length - 1].children = [];
    }

    return tree;
}

const selection = (tree) => {

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

const expansion = (node) => {

    let color = node.color == black ? white : black;
    let moves = shuffle(getValidMoves(node.board, color));

    if (moves.length == 0) {
        moves = shuffle(getValidMoves(node.board, node.color));
        if (moves.length == 0) return node;
        color = node.color;
    }

    for (let move of moves) {

        nodeSetUp(node, move, color);

        // let tempBoard = node.board.map(arr => arr.slice());

        // let reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);
        // // reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

        // node.children.push({});

        // node.children[node.children.length - 1].board = tempBoard;
        // node.children[node.children.length - 1].parent = node;
        // node.children[node.children.length - 1].color = color;
        // node.children[node.children.length - 1].plays = Number.MIN_VALUE;
        // node.children[node.children.length - 1].wins = 0;
        // node.children[node.children.length - 1].children = [];
    }

    return node.children[0];
}

const simulation = (node) => {

    let pass = false;
    let color = node.color == black ? white : black;
    let tempBoard = node.board.map(arr => arr.slice());

    do {

        // let moves = getValidMoves(tempBoard, color);

        let moves = getValidMove(tempBoard, color);


        if (moves.length != 0) {
            pass = false;
            // let move = moves[Math.floor(Math.random() * moves.length)];
            let move = moves;

            makeMove(tempBoard, color, move[0], move[1]);


            // reversedDisks = getFlippedDisks(tempBoard, color, move[0], move[1]);
            // reversedDisks.forEach(disk => tempBoard[disk[0]][disk[1]] = color);

            color = color == black ? white : black;
        } 
        
        if (moves.length == 0 && !pass){
            pass = true;
            color = color == black ? white : black;
            continue;
        }

        if (full(tempBoard) || pass) return winner(tempBoard)[0];
                
    } while(true);
}

const simulation2 = (node) => {

    let color = node.color == black ? white : black;
    let tempBoard = node.board.map(arr => arr.slice());

    do {

        let move = getValidMove(tempBoard, color);

        if (move == null) {

            color = color == black ? white : black;

            move = getValidMove(tempBoard, color);

            if (move == null) return winner(tempBoard)[0];
        }
        
        makeMove(tempBoard, color, move[0], move[1]);

        color = color == black ? white : black;
                
    } while(!full(tempBoard));

    return winner(tempBoard)[0];
}


const backprapogation = (node, color) => {

    do {
        node.plays++;
        if (node.color == color) node.wins++;
        node = node.parent;
    } while (node != null)
} 

const mcts = (board, startTime, initialColor, timeLimit) => {

    if (getValidMoves(board, initialColor).length == 0) return null;

    let tree = setupTree(board, initialColor);

    let i = 0;

    do {

        i++;

        let node = selection(tree);

        if (node.plays != Number.MIN_VALUE) node = expansion(node);

        let winner = simulation2(node);

        backprapogation(node, winner);

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