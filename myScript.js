function generateMinefieldTable(height = 10, width = 10, sweep_action = 'onclick', flag_action = 'oncontextmenu') {
    let output = [];
    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            row.push(
                `<td id='cell-${x}-${y}' ${sweep_action}='sweep(${x}, ${y}); return false;' ${flag_action}='flag(${x}, ${y}); return false;' >
					<button id='button-${x}-${y}' type='button' class='btn btn-primary tile'></button>
				</td>`
            );  
        };
        output.push(`<tr>${row.join('')}</tr>`);
    };
    output = output.join('');
    document.getElementById('minefield').innerHTML = output;
};

var gameOver = false;
function sweep(x, y) {
    if (gameOver) {
        return;
    } else {
        let cell = document.getElementById(`cell-${x}-${y}`);
        if (document.getElementById(`button-${x}-${y}`) == null) {
            return;
        } else if (document.getElementById(`button-${x}-${y}`).innerHTML == ''){
            let cellValue = minefield[y][x];
            if (cellValue === 0) {
                cell.innerHTML = '';
            } else if (cellValue === 9) {
                cell.innerHTML = '<img src="mine.svg" height="25" class="d-inline-block"></img>';
                gameOver = true;
            } else {
                cell.innerHTML = minefield[y][x];
            };
        } else {
            document.getElementById(`button-${x}-${y}`).innerHTML = '';
        };
    };
};

function flag(x, y) {
    if (gameOver) {
        return;
    } else {
        let button = document.getElementById(`button-${x}-${y}`);
        if (button.innerHTML == '') {
            button.innerHTML = '<img src="flag.svg" height="17" class="d-inline-block"></img>';
        } else {
            button.innerHTML = '';
        };
    };
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

var minefield = null;
function generateMinefieldArray(height = 10, width = 10) {
    minefield = new Array(height)
        .fill(null)
        .map(
            () => Array(width).fill(0)
        );

    let fillRatio = 0.2;

    for (let placed = 0; placed <= height * width * fillRatio;) {
        let x = getRandomInt(0, width);
        let y = getRandomInt(0, height);
        if (minefield[y][x] < 9) {
            minefield[y][x] = 9;
            for (let [j, i] of [[-1, -1], [-1, 0], [-1, 1], 
                                [0, -1], [0, 1], 
                                [1, -1], [1, 0], [1, 1]]) {
                if (-1 < y+j && y+j < height && -1 < x+i && x+i < width) {
                    if (minefield[y+j][x+i] < 9) {
                        minefield[y+j][x+i] += 1;
                    };
                };
            };
            placed++;
        };
    };
};
