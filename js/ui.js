const showBoard = () => document.querySelector("body").style.opacity = 1;

const touchScreen = () => matchMedia('(hover: none)').matches;

const squareCoords = (touchedSquare) => {

    let squares = document.querySelectorAll('.square');

    for (let [i, square] of squares.entries()) {
        if (square == touchedSquare) return [Math.floor(i / 8), i % 8];
    }
}

// const clearBoard = () => {

//     let disks = document.querySelectorAll('.disk');

//     for (let i = 0 ; i < 64; i++) {

//         disks[i].style.background = "";
//     }

//     disks[27].style.background = "white";
//     disks[28].style.background = "white";
//     disks[28].style.filter = "invert(100%)"; 
//     disks[35].style.background = "white";
//     disks[35].style.filter = "invert(100%)"; 
//     disks[36].style.background = "white";
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

    disks[27].style.opacity = 1;
    disks[28].style.opacity = 1;
    disks[35].style.opacity = 1;
    disks[36].style.opacity = 1;

}


const showHints = (moves) => {

    let disks = document.querySelectorAll('.disk');

    for (let move of moves) {
        // disks[move[0] * 8 + move[1]].style.opacity = 1;
        if (firstColor == black) {
            disks[move[0] * 8 + move[1]].classList.add("gray-b");
        } else {
            disks[move[0] * 8 + move[1]].classList.add("gray-w");
        }
    }
}

const hideHints = () => {

    let disks = document.querySelectorAll('.disk');

    for (let i = 0 ; i < 64; i++) {
        if (disks[i].classList.contains("gray-b") || disks[i].classList.contains("gray-w")) {
            disks[i].classList.remove("gray-b");
            disks[i].classList.remove("gray-w");

            // disks[i].style.opacity = 0;

            // disks[i].style = "";
            disks[i].style.transition = `opacity 0.8s linear`;;

        }
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

const changeColor = (e) => {

    let disk = e.currentTarget;

    disk.style.animation = "";

    if (disk.classList.contains("black")) {
        disk.classList.remove("black");
        disk.classList.add("white");
        return;
    }

    disk.classList.remove("white");
    disk.classList.add("black");
}


const flipDisks = async(flippedDisks, color) => {

    hideHints();

    hideMove();

    // await new Promise(r => setTimeout(r, 100));

    let disks = document.querySelectorAll('.disk');

    for (let disk of disks) {
         disk.style.transition = ``;
         disk.classList.remove("disappear");
    }
    
    let [r, c] =  [flippedDisks[0][0], flippedDisks[0][1]];

    // disks[flippedDisks[0][0] * 8 + flippedDisks[0][1]].style.background = "white";

    color == black ? disks[r * 8 + c].classList.add("black", "black-move") : disks[r * 8 + c].classList.add("white",  "white-move");

    disks[r * 8 + c].style.transition = `opacity 0.6s linear`;;

    disks[r * 8 + c].style.opacity = 1;

    flippedDisks.shift();

    // for (let [i, disk] of flippedDisks.entries()) {

    //     if (i == 0) {
    //         continue;
    //     }

    //     // disks[disk[0] * 8 + disk[1]].style.transition = `all 0.8s 0.1s linear`;

    //     // disks[disk[0] * 8 + disk[1]].style.transition = `all ${i * 0.5}s 0.1 linear`;

    // }

    for (let [i, disk] of flippedDisks.entries()) {

        // color == black ? disks[disk[0] * 8 + disk[1]].style.animation = "" : disks[disk[0] * 8 + disk[1]].style.filter = "";
        // color == black ? disks[disk[0] * 8 + disk[1]].style.animation = `dis 1.1s 1 linear forwards` : disks[disk[0] * 8 + disk[1]].style.animation = `dis 1.8s 1 linear forwards`;
        // disks[disk[0] * 8 + disk[1]].style.animation = `dis${i + 1} ${0.6 + i * 0.2}s 1 linear forwards`;



        // disks[disk[0] * 8 + disk[1]].style.animation = `dis${disk[2]} ${0.6 + (disk[2] - 1)  * 0.2}s 1 linear forwards`;
        disks[disk[0] * 8 + disk[1]].style.animation = `dis 0.9s 1 linear forwards`;



        disks[disk[0] * 8 + disk[1]].addEventListener('animationend', changeColor); 



        // disks[disk[0] * 8 + disk[1]].style.animation = "";

        // color == black ? disks[disk[0] * 8 + disk[1]].classList.add("disappear") : disks[disk[0] * 8 + disk[1]].classList.add("disappear2");

        // color == black ? disks[disk[0] * 8 + disk[1]].style.filter = "invert(100%)" : disks[disk[0] * 8 + disk[1]].style.filter = "";

        // color == black ? disks[disk[0] * 8 + disk[1]].style.opacity = 0 : disks[disk[0] * 8 + disk[1]].style.opacity = 1;

        // disks[disk[0] * 8 + disk[1]].style.transform = `translateY(100px)`;
    }

    // let move = flippedDisks[0];

    // showMove(move);

    // setTimeout(hideMove, distance(flippedDisks) * 200 + 400 + 100);
}

// const flipDisks = (flippedDisks) => {

//     hideHints();

//     hideMove();

//     let disks = document.querySelectorAll('.disk');

//     for (let disk of flippedDisks) {
//         disks[disk[0] * 8 + disk[1]].classList.remove("black", "white");

//         color == black ? disks[disk[0] * 8 + disk[1]].classList.add("black") :  disks[disk[0] * 8 + disk[1]].classList.add("white");
//     }

//     let move = flippedDisks[0];

//     showMove(move);
// }

const setBoardSize = () => {

    let boardSize;

    if (screen.height > screen.width) {
        boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
    } else {
        boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 8) * 8;
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
