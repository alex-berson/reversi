const createRoot = (board, color) => {

    let revercedColor = color == black ? white : black;
    let root = {};

    root.board = board.map(arr => arr.slice());
    root.parent = null;
    root.color = revercedColor;
    root.plays = Number.MIN_VALUE;
    root.wins = 0;
    root.children = [];

    let moves = shuffle(availableMoves(board, color));

    for (let move of moves) {
        createNode(root, color, move);
    }

    return root;
}

const createNode = (node, color, move) => {

    let tempBoard = node.board.map(arr => arr.slice());

    makeMove(tempBoard, color, move[0], move[1]);

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
    let moves = shuffle(availableMoves(node.board, color));

    if (moves.length == 0) {
        moves = shuffle(availableMoves(node.board, node.color));
        if (moves.length == 0) return node;
        color = node.color;
    }

    for (let move of moves) {
        createNode(node, color, move);
    }

    return node.children[0];
}

const simulation = (node) => {

    let color = node.color == black ? white : black;
    let tempBoard = node.board.map(arr => arr.slice());

    do {

        let move = randomMove(tempBoard, color);

        if (move == null) {

            color = color == black ? white : black;

            move = randomMove(tempBoard, color);

            if (move == null) return winner(tempBoard)[0];
        }
        
        makeMove(tempBoard, color, move[0], move[1]);

        color = color == black ? white : black;
                
    } while (!boardFull(tempBoard));

    return winner(tempBoard)[0];
}


const backprapogation = (node, color) => {

    do {
        node.plays++;

        if (node.color == color) node.wins++;

        node = node.parent;

    } while (node != null)
} 

const mcts = (board, color, startTime, timeLimit) => {

    if (availableMoves(board, color).length == 0) return null;

    let tree = createRoot(board, color);

    do {

        let node = selection(tree);

        if (node.plays != Number.MIN_VALUE) node = expansion(node);

        let winner = simulation(node);

        backprapogation(node, winner);

    } while (!timeOver(startTime, timeLimit));

    let bestMove;
    let bestValue = -Infinity;

    for (child of tree.children) {

        let value = child.wins / child.plays;

        if (value > bestValue) [bestValue, bestMove] = [value, child.move];
    }

    return bestMove;
}
