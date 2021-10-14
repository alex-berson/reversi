let board = [];

const showBoard = () => document.querySelector("body").style.opacity = 1;

const resetBoard = () => board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

const setBoard = () => {

    board = [[0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,2,1,0,0,0],
             [0,0,0,1,2,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0],
             [0,0,0,0,0,0,0,0]]

    let disks = document.querySelectorAll('.disk');

    for (let r = 0 ; r < 8; r++) {
        for(let c = 0; c < 8; c++ ) {
            if (board[r][c] == 1) disks[r * 8 + c].classList.add("black");
            if (board[r][c] == 2) disks[r * 8 + c].classList.add("white");
        }
    }
}

const disableTapZoom = () => {
    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchstart', preventDefault, {passive: false});
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

// const disableTouch = () => {
//     document.querySelectorAll('.square').forEach((tile) => {
//       tile.removeEventListener('touchstart', startMove);
//       tile.removeEventListener('mousedown', startMove);
//     });
// }

// const enableTouch = () => {
//     document.querySelectorAll('.square').forEach((tile) => {
//       tile.addEventListener('touchstart', startMove);
//       tile.addEventListener('mousedown', startMove);
//     });
// }


const init = () => {

    // disableTapZoom();

    setBoard();

    setBoardSize();
    
    showBoard();

    // setTimeout(enableTouch, 1000);

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
