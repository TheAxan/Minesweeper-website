function generateMinefieldTable(height = 10, width = 10, sweep_action = 'onclick', flag_action = 'oncontextmenu') {
    let output = [];
    for (let y = 0; y <= height; y++) {
        let row = [];
        for (let x = 0; x <= width; x++) {
            row.push(
                `<td id='cell-${x}-${y}' ${sweep_action}='sweep(${x}, ${y})' ${flag_action}='flag(${x}, ${y})'>
					<button id='button-${x}-${y}' type='button' class='btn btn-primary tile'></button>
				</td>`
            );  
        };
        output.push(`<tr>${row.join('')}</tr>`);
    };
    output = output.join('');
    document.getElementById('minefield').innerHTML = output;
};

function sweep(x, y) {
    document.getElementById(`cell-${x}-${y}`).innerHTML = ''
};

function flag(x, y) {
    document.getElementById(`button-${x}-${y}`).insertAdjacentHTML('afterbegin', '<img src="flag.svg" height="17" class="d-inline-block"></img>')
};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

function generateMinefieldArray(height = 10, width = 10) {
    let minefield = new Array(height)
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
                    minefield[y+j][x+i] += 1;
                };
            };
            placed++;
        };
    };
};
