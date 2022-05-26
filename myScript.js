let gridHeight = parseInt(localStorage.getItem('gridHeight')) || 9;
let gridWidth = parseInt(localStorage.getItem('gridWidth')) || 9;
let fillRatio = localStorage.getItem('fillRatio') || 0.2; // if this is too high the guaranteed empty start can take a while
let sweepAction = localStorage.getItem('sweepAction') || 'onclick';
let flagAction = localStorage.getItem('flagAction') || 'oncontextmenu';


function generateMinefieldTable(targetId) {
    let output = [];
    for (let y = 0; y < gridHeight; y++) {
        let row = [];
        for (let x = 0; x < gridWidth; x++) {
            row.push(
                `<td id='cell-${x}-${y}'  height='31px' width='31px'>
					<button id='button-${x}-${y}' type='button'
                            class='btn btn-primary tile'
                            ${sweepAction}='sweep(${x}, ${y});
                                            event.stopPropagation();
                                            return false;'
                            ${flagAction}='flag(${x}, ${y});
                                           return false;'
                    ></button>
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


function neighborsArray(x, y) {
    let output = new Array;
    for (let [i, j] of [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ]) {
        if (-1 < y+j && y+j < gridHeight && -1 < x+i && x+i < gridWidth) {
           output.push([x+i, y+j]);
        };
    };
    return output;
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
            for (let [i, j] of neighborsArray(x, y)) {
                raiseMinecount(i, j);
            };
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
    document.getElementById('playAgainButtonSlot').innerHTML =`<br>
        <button class="btn btn-primary" href="#" 
                onclick="location.reload(true); return false;">
          Play again
        </button>`
    ;
};


var explored = new Set();
function sweep(x, y) {
    regenerateMinefield(x, y);
    sweep = gameStartedSweep;
    sweep(x, y);
};


function gameStartedSweep(x, y, recursive=false) {
    if (!explored.has(String([x, y]))) {
        let cell = document.getElementById(`cell-${x}-${y}`);
        let cellValue = minefield[y][x];
        if (cellValue === 0) {
            cell.innerHTML = '';
            explored.add(String([x, y]));
            for (let [i, j] of neighborsArray(x, y)) {
                sweep(i, j, true);
            };
        } else if (cellValue === 9) {
            cell.innerHTML = mineSVG('#FFFFFF');
            sweep = flag = gameOverAction;
            generatePlayAgainButton();
        } else {
            cell.innerHTML = cellValue;
            cell.setAttribute(
                sweepAction, 
                `sweep(${x}, ${y});
                event.stopPropagation();
                return false;`
            )
            explored.add(String([x, y]));
        };
        checkForWin();
    } else if (!recursive) {  // manual sweep
        if (document.getElementById(`button-${x}-${y}`) != null) { // flagged
            flag(x, y);  // unflagging
        } else { // chaining
            for (let [i, j] of neighborsArray(x, y)) {
                sweep(i, j, true);
            };
        };
    };
};


function gameOverAction() {
    return;
};


function flag(x, y) {
    let button = document.getElementById(`button-${x}-${y}`);
    if (button.innerHTML == '') {
        button.innerHTML = flagSVG('#FFFFFF');
        mineCounter--;
        generateMineCounter();
        explored.add(String([x, y]));
    } else {
        button.innerHTML = '';
        mineCounter++;
        generateMineCounter();
        explored.delete(String([x, y]));
    };
    checkForWin();
};



function flagSVG(color = '#000000'){
	return `<svg viewBox="0 0 52 91" height="17" class="d-inline-block">
		<defs>
			<style>
                .flagStyle{
                    stroke:${color};
                    fill:${color};
                    stroke-linecap:round;
                    stroke-linejoin:round;
                    stroke-width:12px;
                }
            </style>
		</defs>
		<line class="flagStyle" x1="46" y1="85" x2="46" y2="46"/>
		<polygon class="flagStyle" points="6 26 46 46 46 6 6 26"/>
	</svg>`;
};


function gearSVG(color = '#000000'){
	return `<svg viewBox="0 0 80.97 80.97" width="60">
		<defs>
			<style>
                .gearStyle{
                    fill:${color};
                    stroke:${color};
                    stroke-linejoin:round;
                    stroke-width:4px;
                }
            </style>
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


function mineSVG(color = '#000000', height = '25', specifier = ''){
	return `<svg viewBox="0 0 90 90" height=${height} class="d-inline-block">
		<defs>
			<style>
                .mineCircle${specifier}Style, .mineLine${specifier}Style {
                    fill:${color} !important;
                    stroke:${color} !important;
                    stroke-miterlimit:10;
                }
                .mineLine${specifier}Style {
                    stroke-linecap:round;
                    stroke-width:10px;
                }
            </style>
		</defs>
		<circle class="mineCircle${specifier}Style" cx="45" cy="45" r="25"/>
		<line class="mineLine${specifier}Style" x1="85" y1="45" x2="5" y2="45"/>
		<line class="mineLine${specifier}Style" x1="73.28" y1="16.72" x2="16.72" y2="73.28"/>
		<line class="mineLine${specifier}Style" x1="45" y1="5" x2="45" y2="85"/>
		<line class="mineLine${specifier}Style" x1="16.72" y1="16.72" x2="73.28" y2="73.28"/>
	</svg>`;
};


function generateMineHeader(targetId, color = '#000000'){
	document.getElementById(targetId).insertAdjacentHTML(
        'afterbegin',
        String(mineSVG(color, 100, 'Icon'))
    );
};


function generateMineCounter(targetId = 'mineCounter', color = '#FFFFFF'){
    document.getElementById(targetId)
        .innerHTML = mineCounter + ' ' + mineSVG(color);
};


// enable tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
));
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});


function generateDropdown() {
    document.getElementById('sizeDropdown')
        .innerHTML = `Grid size (${tempHeight} x ${tempWidth}) `;
    document.getElementById('fillRatioDropdown')
        .innerHTML = `Fill ratio (${tempFillRatio * 100}%) `;
};


let tempHeight = gridHeight;
let tempWidth = gridWidth;
function setSize(height, width) {
    tempHeight = height;
    tempWidth = width;
    generateDropdown();
};

let tempFillRatio = fillRatio;
function setFillRatio(ratio) {
    tempFillRatio = ratio;
    generateDropdown();
};


function applyChanges() {
    localStorage.setItem('gridHeight', tempHeight);
    localStorage.setItem('gridWidth', tempWidth);
    localStorage.setItem('fillRatio', tempFillRatio);
    location.reload(true)
};


function cancelChanges() {
    tempHeight = gridHeight;
    tempWidth = gridWidth;
    tempFillRatio = fillRatio;
    generateDropdown();
};


generateMinefieldTable('minefield');
generateMinefieldArray();
generateGear('gear', '#FFFFFF');
generateMineHeader('mineHeader','#FFFFFF');
generateMineCounter();
generateDropdown();
