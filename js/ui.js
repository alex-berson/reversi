let disks = document.querySelectorAll('.disk');
let squares = document.querySelectorAll('.square');

const showBoard = () => document.body.style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const squareCoords = (touchedSquare) => {

    for (let [i, square] of squares.entries()) {
        if (square == touchedSquare) return [Math.floor(i / 8), i % 8];
    }
}

const clearBoard = () => {

    for (let disk of disks) {
        disk.style = '';
    }

    setTimeout(() => {
        for (let disk of disks) {
            disk.classList.remove("black", "white");
            disk.innerText = '';
        }
    }, 600);
}

const initialDisksPlacement = () => {

    disks[27].classList.add("white");
    disks[28].classList.add("black");
    disks[35].classList.add("black");
    disks[36].classList.add("white");

    setTimeout(() => {disks[27].style.opacity = 1}, 0);
    setTimeout(() => {disks[28].style.opacity = 1}, 600);
    setTimeout(() => {disks[35].style.opacity = 1}, 1200);
    setTimeout(() => {disks[36].style.opacity = 1}, 1800);
}

const countDisks = () => {

    let i = -1;
    let blacks = 0;
    let whites = 0;
    let countInterval;

    const counter = () => {

        do {

            i++;

            if (i > 63) {clearInterval(countInterval); break}

            if (board[Math.floor(i / 8)][i % 8] == white) {
                whites++;
                disks[i].innerText = whites;
                break;
            }

            if (board[Math.floor(i / 8)][i % 8] == black) {
                blacks++;
                disks[i].innerText = blacks;
                break;
            }

        } while (true);
    }

    countInterval = setInterval(counter, 50);
}

const showHints = (moves) => {

    for (let move of moves) {
        if (playerColor == black) {
            disks[move[0] * 8 + move[1]].classList.add("hint-b");
        } else {
            disks[move[0] * 8 + move[1]].classList.add("hint-w");
        }
    }
}

const hideHints = () => {

    for (let disk of disks) {
            disk.classList.remove("hint-b");
            disk.classList.remove("hint-w");
    }
}

const flipDisks = (flippedDisks, color) => {
    
    let [r, c] =  [flippedDisks[0][0], flippedDisks[0][1]];

    color == black ? disks[r * 8 + c].classList.add("black") : disks[r * 8 + c].classList.add("white");

    disks[r * 8 + c].style.opacity = 1;

    flippedDisks.shift();

    for (let disk of flippedDisks) {
        disks[disk[0] * 8 + disk[1]].style.animation = `inversion 0.9s 1 linear forwards`;
        disks[disk[0] * 8 + disk[1]].addEventListener('animationend', (e) => {

            let disk = e.currentTarget;

            disk.style.animation = "";
        
            if (disk.classList.contains("black")) {
                disk.classList.remove("black");
                disk.classList.add("white");
            } else {
                disk.classList.remove("white");
                disk.classList.add("black");
            }
        }, {once: true}); 
    }
}

const setBoardSize = () => {

    let boardSize;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
    }

    let diskSize = Math.ceil(boardSize / 8 / 1.2 / 2) * 2;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    document.documentElement.style.setProperty('--disk-size', diskSize + 'px');
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}

const enableTouch = () => {

    for (let square of squares){
        if (touchScreen()){
            square.addEventListener("touchstart", humanTurn);
        } else {
            square.addEventListener("mousedown", humanTurn);
        }
    }
}

const disableTouch = () => {

    for (let square of squares){
        if (touchScreen()){
            square.removeEventListener("touchstart", humanTurn);
        } else {
            square.removeEventListener("mousedown", humanTurn);
        }
    }
}