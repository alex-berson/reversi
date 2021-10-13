const showBoard = () => document.querySelector("body").style.opacity = 1;

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

    setBoardSize();
    
    showBoard();

    // setTimeout(enableTouch, 1000);

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init();
    }); 
};
