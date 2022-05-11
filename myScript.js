function generateMinefieldTable(targetId, sweepAction = 'onclick', flagAction = 'oncontextmenu') {
    let output = [];
    for (let y = 0; y < gridHeight; y++) {
        let row = [];
        for (let x = 0; x < gridWidth; x++) {
            row.push(
                `<td id='cell-${x}-${y}' ${sweepAction}='sweep(${x}, ${y}); return false;' ${flagAction}='flag(${x}, ${y}); return false;' height='31px' width='31px'>
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


function forNeighbors(x, y, target) {
    for (let [j, i] of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
        if (-1 < y+j && y+j < gridHeight && -1 < x+i && x+i < gridWidth) {
            target(x+i, y+j);
        };
    };
};


function raiseMinecount(x, y) {
    if (minefield[y][x] < 9) {
        minefield[y][x]++;
    };
};


var minefield = null;
var mineCounter = Math.round(gridHeight * gridWidth * fillRatio);
function generateMinefieldArray() {
    minefield = new Array(gridHeight)
        .fill(null)
        .map(
            () => Array(gridWidth).fill(0)
        );
    for (let placed = 0; placed < mineCounter;) {
        let x = getRandomInt(0, gridWidth);
        let y = getRandomInt(0, gridHeight);
        if (minefield[y][x] < 9) {
            minefield[y][x] = 9;
            forNeighbors(x, y, raiseMinecount);
            placed++;
        };
    };
};


function regenerateMinefield(x, y) {
    if (minefield[y][x] !== 0) {
        generateMinefieldArray();
        regenerateMinefield(x, y);
    };
};


function checkForWin() {
    if (explored.size + mineCounter == gridHeight * gridWidth) {
        document.getElementById('mineCounter').innerHTML = 'Well played!';
        generatePlayAgainButton();
    };

};


function generatePlayAgainButton(){
    document.getElementById('minefield').insertAdjacentHTML(
        'beforebegin',
        '<br><button class="btn btn-primary m-2" href="#" onclick="location.reload(true); return false;">Play again</button>'
    );
};


var gameOver = false;
var gameStarted = false;
var explored = new Set();
function sweep(x, y) {
    if (gameOver) {
        return;
    } else if (!gameStarted) {
        regenerateMinefield(x, y);
        gameStarted = true;
        sweep(x, y);
    } else if (!explored.has(String([x, y]))) {
        let cell = document.getElementById(`cell-${x}-${y}`);
        if (document.getElementById(`button-${x}-${y}`) == null) {
            return;
        } else if (document.getElementById(`button-${x}-${y}`).innerHTML == ''){
            let cellValue = minefield[y][x];
            if (cellValue === 0) {
                cell.innerHTML = '';
                explored.add(String([x, y]));
                forNeighbors(x, y, sweep);
            } else if (cellValue === 9) {
                cell.innerHTML = mineSVG('#FFFFFF');
                gameOver = true;
                generatePlayAgainButton();
                } else {
                    cell.innerHTML = cellValue;
                    explored.add(String([x, y]));
            };
        } else {
            document.getElementById(`button-${x}-${y}`).innerHTML = '';
        };
        checkForWin();
    };
};


function flag(x, y) {
    if (gameOver) {
        return;
    } else {
        let button = document.getElementById(`button-${x}-${y}`);
        if (button.innerHTML == '') {
            button.innerHTML = flagSVG('#FFFFFF');
            mineCounter--;
            generateMineCounter('mineCounter', '#FFFFFF');
            explored.add(String([x, y]));
        } else {
            button.innerHTML = '';
            mineCounter++;
            generateMineCounter('mineCounter', '#FFFFFF');
            explored.delete(String([x, y]));
        };
        checkForWin();
    };
};


function flagSVG(color = '#000000'){
	return `<svg viewBox="0 0 52 91" height="17" class="d-inline-block">
		<defs>
			<style>.flagStyle{stroke:${color};fill:${color};stroke-linecap:round;stroke-linejoin:round;stroke-width:12px;}</style>
		</defs>
		<line class="flagStyle" x1="46" y1="85" x2="46" y2="46"/>
		<polygon class="flagStyle" points="6 26 46 46 46 6 6 26"/>
	</svg>`;
};


function gearSVG(color = '#000000'){
	return `<svg viewBox="0 0 80.97 80.97" width="60">
		<defs>
			<style>.gearStyle{fill:${color};stroke:${color};stroke-linejoin:round;stroke-width:4px;}</style>
		</defs>
		<path class="gearStyle" d="M40.49,30.49c.06,0,.13,0,.19,0L28.87,2l-7.39,3.06,11.8,28.5c1.82-1.89,4.37-3.07,7.2-3.07Z"/>
		<path class="gearStyle" d="M47.69,47.42c-1.82,1.89-4.37,3.07-7.2,3.07-.06,0-.13,0-.19,0l11.8,28.5,7.39-3.06-11.8-28.5Z"/>
		<path class="gearStyle" d="M33.56,33.29L5.06,21.48l-3.06,7.39,28.5,11.8c0-.06,0-.13,0-.19,0-2.83,1.18-5.38,3.07-7.2Z"/>
		<path class="gearStyle" d="M50.48,40.29c0,.06,0,.13,0,.19,0,2.83-1.18,5.38-3.07,7.2l28.5,11.8,3.06-7.39-28.5-11.8Z"/>
		<path class="gearStyle" d="M30.5,40.29L2,52.1l3.06,7.39,28.5-11.8c-1.89-1.82-3.07-4.37-3.07-7.2,0-.06,0-.13,0-.19Z"/>
		<path class="gearStyle" d="M78.97,28.87l-3.06-7.39-28.5,11.8c1.89,1.82,3.07,4.37,3.07,7.2,0,.06,0,.13,0,.19l28.5-11.8Z"/>
		<path class="gearStyle" d="M33.29,47.42l-11.8,28.5,7.39,3.06,11.8-28.5c-.06,0-.13,0-.19,0-2.83,0-5.38-1.18-7.2-3.07Z"/>
		<path class="gearStyle" d="M47.69,33.56L59.49,5.06l-7.39-3.06-11.8,28.5c.06,0,.13,0,.19,0,2.83,0,5.38,1.18,7.2,3.07Z"/>
		<path class="gearStyle" d="M40.49,12.99c-15.19,0-27.5,12.31-27.5,27.5s12.31,27.5,27.5,27.5,27.5-12.31,27.5-27.5-12.31-27.5-27.5-27.5Zm0,35c-4.14,0-7.5-3.36-7.5-7.5s3.36-7.5,7.5-7.5,7.5,3.36,7.5,7.5-3.36,7.5-7.5,7.5Z"/>
	</svg>`;
};


function generateGear(targetId, color ='#000000'){
	document.getElementById(targetId).innerHTML = gearSVG(color);
};


function mineSVG(color = '#000000', height = '25', specifierInfo = ''){
	return `<svg viewBox="0 0 90 90" height=${height} class="d-inline-block">
		<defs>
			<style>
                .mineCircle${specifierInfo}Style, .mineLine${specifierInfo}Style {fill:${color} !important;stroke:${color} !important;stroke-miterlimit:10;}
                .mineLine${specifierInfo}Style {stroke-linecap:round;stroke-width:10px;}
            </style>
		</defs>
		<circle class="mineCircle${specifierInfo}Style" cx="45" cy="45" r="25"/>
		<line class="mineLine${specifierInfo}Style" x1="85" y1="45" x2="5" y2="45"/>
		<line class="mineLine${specifierInfo}Style" x1="73.28" y1="16.72" x2="16.72" y2="73.28"/>
		<line class="mineLine${specifierInfo}Style" x1="45" y1="5" x2="45" y2="85"/>
		<line class="mineLine${specifierInfo}Style" x1="16.72" y1="16.72" x2="73.28" y2="73.28"/>
	</svg>`;
};


function generateMineHeader(targetId, color = '#000000'){
	document.getElementById(targetId).insertAdjacentHTML('afterbegin', String(mineSVG(color, 100, 'Icon')));
};


function generateMineCounter(targetId, color){
    document.getElementById(targetId).innerHTML = mineCounter + ' ' + mineSVG(color);
};