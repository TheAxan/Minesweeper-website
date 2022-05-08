function generateMinefieldTable(targetId, height = 10, width = 10, sweepAction = 'onclick', flagAction = 'oncontextmenu') {
    let output = [];
    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            row.push(
                `<td id='cell-${x}-${y}' ${sweepAction}='sweep(${x}, ${y}); return false;' ${flagAction}='flag(${x}, ${y}); return false;' >
					<button id='button-${x}-${y}' type='button' class='btn btn-primary tile'></button>
				</td>`
            );  
        };
        output.push(`<tr>${row.join('')}</tr>`);
    };
    output = output.join('');
    document.getElementById(targetId).innerHTML = output;
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
            for (let [j, i] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
                if (-1 < y+j && y+j < height 
                        && -1 < x+i && x+i < width 
                        && minefield[y+j][x+i] < 9) {
                    minefield[y+j][x+i]++;
                };
            };
            placed++;
        };
    };
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
                cell.innerHTML = mineSVG();
                gameOver = true;
            } else {
                cell.innerHTML = cellValue;
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
            button.innerHTML = flagSVG();
        } else {
            button.innerHTML = '';
        };
    };
};

function flagSVG(color = '#000000'){
	return `<svg viewBox="0 0 52 91" height="17" class="d-inline-block">
		<defs>
			<style>.b{stroke:${color};stroke-linecap:round;stroke-linejoin:round;stroke-width:12px;}</style>
		</defs>
		<line class="b" x1="46" y1="85" x2="46" y2="46"/>
		<polygon class="b" points="6 26 46 46 46 6 6 26"/>
	</svg>`;
};

function gearSVG(color = '#000000'){
	return `<svg viewBox="0 0 80.97 80.97" width="60">
		<defs>
			<style>.b{fill:${color};stroke:${color};stroke-linejoin:round;stroke-width:4px;}</style>
		</defs>
		<path class="b" d="M40.49,30.49c.06,0,.13,0,.19,0L28.87,2l-7.39,3.06,11.8,28.5c1.82-1.89,4.37-3.07,7.2-3.07Z"/>
		<path class="b" d="M47.69,47.42c-1.82,1.89-4.37,3.07-7.2,3.07-.06,0-.13,0-.19,0l11.8,28.5,7.39-3.06-11.8-28.5Z"/>
		<path class="b" d="M33.56,33.29L5.06,21.48l-3.06,7.39,28.5,11.8c0-.06,0-.13,0-.19,0-2.83,1.18-5.38,3.07-7.2Z"/>
		<path class="b" d="M50.48,40.29c0,.06,0,.13,0,.19,0,2.83-1.18,5.38-3.07,7.2l28.5,11.8,3.06-7.39-28.5-11.8Z"/>
		<path class="b" d="M30.5,40.29L2,52.1l3.06,7.39,28.5-11.8c-1.89-1.82-3.07-4.37-3.07-7.2,0-.06,0-.13,0-.19Z"/>
		<path class="b" d="M78.97,28.87l-3.06-7.39-28.5,11.8c1.89,1.82,3.07,4.37,3.07,7.2,0,.06,0,.13,0,.19l28.5-11.8Z"/>
		<path class="b" d="M33.29,47.42l-11.8,28.5,7.39,3.06,11.8-28.5c-.06,0-.13,0-.19,0-2.83,0-5.38-1.18-7.2-3.07Z"/>
		<path class="b" d="M47.69,33.56L59.49,5.06l-7.39-3.06-11.8,28.5c.06,0,.13,0,.19,0,2.83,0,5.38,1.18,7.2,3.07Z"/>
		<path class="b" d="M40.49,12.99c-15.19,0-27.5,12.31-27.5,27.5s12.31,27.5,27.5,27.5,27.5-12.31,27.5-27.5-12.31-27.5-27.5-27.5Zm0,35c-4.14,0-7.5-3.36-7.5-7.5s3.36-7.5,7.5-7.5,7.5,3.36,7.5,7.5-3.36,7.5-7.5,7.5Z"/>
	</svg>`;
};

function generateGear(targetId, color ='#000000'){
	document.getElementById(targetId).innerHTML = gearSVG(color);
};

function mineSVG(color = '#000000', height = '25'){
	return `<svg viewBox="0 0 90 90" height=${height} class="d-inline-block">
		<defs>
			<style>.b,.c{fill:${color};stroke:${color};stroke-miterlimit:10;}.c{stroke-linecap:round;stroke-width:10px;}</style>
		</defs>
		<circle class="b" cx="45" cy="45" r="25"/>
		<line class="c" x1="85" y1="45" x2="5" y2="45"/>
		<line class="c" x1="73.28" y1="16.72" x2="16.72" y2="73.28"/>
		<line class="c" x1="45" y1="5" x2="45" y2="85"/>
		<line class="c" x1="16.72" y1="16.72" x2="73.28" y2="73.28"/>
	</svg>`;
};

function generateMine(targetId, color = '#000000'){
	document.getElementById(targetId).insertAdjacentHTML('afterbegin', mineSVG(color, 100));
};