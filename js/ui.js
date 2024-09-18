const disks = document.querySelectorAll('.disk');

const showBoard = () => document.body.style.opacity = 1;

const hideHints = () => disks.forEach(disk => disk.classList.remove('hint-b', 'hint-w'));

const showHints = () => {

    let moves = availableMoves(board, player);

    moves.forEach(move => disks[move.r * size + move.c].classList.add(human == black ? 'hint-b' : 'hint-w'));
}

const squareCoords = (square) => {

    let squares = document.querySelectorAll('.square');
    let index = [...squares].indexOf(square);

    return [Math.floor(index / size), index % size];
}

const setBoardSize = () => {

    let minSide = screen.height > screen.width ? screen.width : window.innerHeight;
    let cssBoardSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 100;
    let boardSize = Math.ceil(minSide * cssBoardSize / size) * size;
    let diskSize = Math.ceil(boardSize / size / 1.2 / 2) * 2;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    document.documentElement.style.setProperty('--disk-size', diskSize + 'px');
}

const startingSetup = () => {

    let initialSetup = [{sq: 27, color: 'white'}, {sq: 28, color: 'black'}, 
                        {sq: 35, color: 'black'}, {sq: 36, color: 'white'}];
  
    initialSetup.forEach(({sq, color}, i) => {
        setTimeout(() => disks[sq].classList.add(color, 'visible'), i * 600);
    });
}

const flipDisks = (flippedDisks, color) => {
    
    let {r, c} =  flippedDisks.shift();
    let i = r * size + c;

    disks[i].classList.add(color == black ? 'black' : 'white', 'visible');

    for (let disk of flippedDisks) {

        let i = disk.r * size + disk.c;

        disks[i].classList.add('inversion');

        disks[i].addEventListener('animationend', (e) => {

            let disk = e.currentTarget;

            disk.classList.toggle('black');
            disk.classList.toggle('white');
            disk.classList.remove('inversion');

        }, {once: true}); 
    }
}

const countDisks = () => {

    let i = 0;
    let blacks = 0;
    let whites = 0;
  
    let counting = setInterval(() => {

        while (i < size ** 2) {

            let [r, c] = [Math.floor(i / size), i % size];
  
            if (board[r][c] == white) {

                whites++;
                disks[i].innerText = whites;
                i++;

                return;

            } else if (board[r][c] == black) {

                blacks++;
                disks[i].innerText = blacks;
                i++;

                return;
            }
  
            i++;
        }
  
        clearInterval(counting);

    }, 50);
}

const endGame = () => {

    setTimeout(countDisks, 500);

    setTimeout(() => {

        document.querySelector('.board').addEventListener('touchstart', newGame);
        document.querySelector('.board').addEventListener('mousedown', newGame);

    }, 500 + 50 + 50 * (winner(board)[1] + winner(board)[2]));
}
  
const clearBoard = () => {

    let disks = document.querySelectorAll('.black, .white');

    document.querySelector('.board').removeEventListener('touchstart', newGame);
    document.querySelector('.board').removeEventListener('mousedown', newGame);

    for (let disk of disks) {

        disk.classList.remove('visible');

        disk.addEventListener('transitionend', () => {

            disk.classList.remove('black', 'white');
            disk.innerText = '';

        }, {once: true});
    }
}

const enableTouch = () => {

    let squares = document.querySelectorAll('.square');

    for (let square of squares) {

        square.addEventListener('touchstart', humanTurn);
        square.addEventListener('mousedown', humanTurn);
    }
}

const disableTouch = () => {

    let squares = document.querySelectorAll('.square');

    for (let square of squares) {

        square.removeEventListener('touchstart', humanTurn);
        square.removeEventListener('mousedown', humanTurn);
    }
}

const disableTapZoom = () => {
    
    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}