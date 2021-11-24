const showBoard = () => document.querySelector("body").style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const squareCoords = (touchedSquare) => {

    let squares = document.querySelectorAll('.square');

    for (let [i, square] of squares.entries()) {
        if (square == touchedSquare) return [Math.floor(i / 8), i % 8];
    }
}

// const redrawBoard = () => {

//     let disks = document.querySelectorAll('.disk');

//     for (let r = 0 ; r < 8; r++) {
//         for(let c = 0; c < 8; c++ ) {

//             disks[r * 8 + c].className = "disk";

//             if (board[r][c] == black) disks[r * 8 + c].classList.add("black");
//             if (board[r][c] == white) disks[r * 8 + c].classList.add("white");
//             if (board[r][c] == gray) disks[r * 8 + c].classList.add("gray");
//             if (board[r][c] == blackDot) disks[r * 8 + c].classList.add("black-move");
//             if (board[r][c] == whiteDot) disks[r * 8 + c].classList.add("white-move");
//         }
//     }
// }

const clearBoard = () => {

    let disks = document.querySelectorAll('.disk');

    for (let i = 0 ; i < 64; i++) {
        disks[i].classList.remove("black", "white", "black-move", "white-move");
    }

    disks[27].classList.add("white");
    disks[28].classList.add("black");
    disks[35].classList.add("black");
    disks[36].classList.add("white");
}


const showHints = (moves) => {

    let disks = document.querySelectorAll('.disk');

    for (let move of moves) {
        disks[move[0] * 8 + move[1]].classList.add("gray");
    }
}

const hideHints = () => {

    let disks = document.querySelectorAll('.disk');

    for (let i = 0 ; i < 64; i++) {
        disks[i].classList.remove("gray");
    }
}

const showMove = (move) => {

    let disk = document.querySelectorAll('.disk')[move[0] * 8 + move[1]];

    color == black ? disk.classList.add("black-move") : disk.classList.add("white-move");
}

const hideMove = () => {

    let disks = document.querySelectorAll('.disk');

    for (let i = 0 ; i < 64; i++) {
        disks[i].classList.remove("black-move", "white-move");
    }
} 


const flipDisks = (flippedDisks) => {

    hideHints();

    hideMove();

    let disks = document.querySelectorAll('.disk');

    for (let disk of flippedDisks) {
        disks[disk[0] * 8 + disk[1]].classList.remove("black", "white");

        color == black ? disks[disk[0] * 8 + disk[1]].classList.add("black") :  disks[disk[0] * 8 + disk[1]].classList.add("white");
    }

    let move = flippedDisks[0];

    showMove(move);
}

const setBoardSize = () => {

    if (screen.height > screen.width) {
         var boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
    } else {
         var boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
    }

    let holeSize = Math.ceil(boardSize / 8 / 1.2 / 2) * 2;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    document.documentElement.style.setProperty('--hole-size', holeSize + 'px');
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
}

const enableTouch = () => {

    let squares = document.querySelectorAll('.square');

    for (let square of squares){
        if (touchScreen()){
            square.addEventListener("touchstart", humanTurn);
        } else {
            square.addEventListener("mousedown", humanTurn);
        }
    }
}

const disableTouch = () => {

    let squares = document.querySelectorAll('.square');

    for (let square of squares){
        if (touchScreen()){
            square.removeEventListener("touchstart", humanTurn);
        } else {
            square.removeEventListener("mousedown", humanTurn);
        }
    }
}
