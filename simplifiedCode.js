// Welcome to behind the scenes!
// Here you can see how the core of the website (the game in it of itself) works.
// If you want to see the whole project you can go on https://github.com/TheAxan/Minesweeper-website


// First off, we need to generate the minefield data which is in the form of an array
var minefield = null;
var mineCounter = Math.round(gridHeight * gridWidth * fillRatio);
function generateMinefieldArray() {
    // we generate a two dimensional array with the set sizes
    minefield = new Array(gridHeight)
        .fill(null)
        .map(
            () => Array(gridWidth).fill(0)
        );
    // then we iteratively place new mines in it
    for (let placed = 0; placed < mineCounter;) {
        let x = getRandomInt(0, gridWidth);
        let y = getRandomInt(0, gridHeight);
        // of course, we don't add mines on other mines
        if (minefield[y][x] < 9) {
            minefield[y][x] = 9;
            // here we use the neighborsArray function which we will declare soon
            for (let [i, j] of neighborsArray(x, y)) {
                // same for raiseMinecount
                raiseMinecount(i, j);
            };
            placed++;
        };
    };
};

// since we're only declaring functions, the order isn't important yet
// so, in generateMinefieldArray we can use neighborsArray
function neighborsArray(x, y) {
    let output = new Array;
    for (let [i, j] of [
        // we iterate over the cells around the center one
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ]) {
        // and if they're in the grid
        if (-1 < y+j && y+j < gridHeight && -1 < x+i && x+i < gridWidth) {
            // we add their coordinates to the output
            output.push([x+i, y+j]);
        };
    };
    return output;
};
// and raiseMinecount, which, well, raises the count of mines around the cell
function raiseMinecount(x, y) {
    if (minefield[y][x] < 9) {
        minefield[y][x]++;
    };
};

// Then we need to keep track of which cells have been explored
var explored = new Set();
// with this new set, we can setup a win condition!
function checkForWin() {
    if (explored.size + mineCounter == gridHeight * gridWidth) {
        document.getElementById('mineCounter').innerHTML = 'Well played!';
        generatePlayAgainButton();
    };
};

// Next up is interacting with the playboard with the sweep function
// since the first sweep must be a 0 the first sweep creates the minefield
// and then it rebinds itself to the real function
function sweep(x, y) {
    regenerateMinefield(x, y);
    sweep = gameStartedSweep;
    sweep(x, y);
};
// regenerateMinefield recursively generates minefields until there is one with 0 as the first sweep
function regenerateMinefield(x, y) {
    if (minefield[y][x] !== 0) {
        generateMinefieldArray();
        regenerateMinefield(x, y);
    };
};
// here we have the real sweep fonction
// quite beefy isn't it?
function gameStartedSweep(x, y, recursive=false) {
    // there are two contexts in which the sweep fonction is called
    // the first one is when you're sweeping an unexplored cell
    if (!explored.has(String([x, y]))) {
        let cell = document.getElementById(`cell-${x}-${y}`);
        let cellValue = minefield[y][x];
        
        // when the cell has no mine around it
        if (cellValue === 0) {
            cell.innerHTML = '';
            explored.add(String([x, y]));
            // we automatically explore the cells around, this is recursion!
            for (let [i, j] of neighborsArray(x, y)) {
                sweep(i, j, true);
            };
        
        // when we hit a mine 
        } else if (cellValue === 9) {
            // we need to display it
            cell.innerHTML = mineSVG('#FFFFFF');
            // stop interactions
            sweep = flag = gameOverAction;
            // and prompt the play to retry
            generatePlayAgainButton();
        // if there's mines AROUND the cell
        } else {
            // we identify how many there are
            cell.innerHTML = cellValue;
            // setup the chaining interaction
            cell.setAttribute(
                sweepAction, 
                `sweep(${x}, ${y});
                event.stopPropagation();
                return false;`
            )
            // and add it to the explored set
            explored.add(String([x, y]));
        };
        // a sweep can be the last one, so we check for the win condition
        checkForWin();
    // the second one is when you're sweeping an explored cell
    // however the sweep recursion can also sweep these cells
    // which is why we prevent it with the recursive condition
    } else if (!recursive) {
        // Sometimes the explored cell has flag
        if (document.getElementById(`button-${x}-${y}`) != null) {
            // so we call the flag function to remove the flag
            flag(x, y);
        // Otherwise, it's for chain sweeping
        } else {
            for (let [i, j] of neighborsArray(x, y)) {
                sweep(i, j, true);
            };
        };
    };
};

// if we rebind sweep and flag to gameOverAction they can't do anything
function gameOverAction() {
    return;
};

// of course we also need to declare the flag fonction
function flag(x, y) {
    let button = document.getElementById(`button-${x}-${y}`);
    // if the button doesn't have a flag
    if (button.innerHTML == '') {
        // we add one
        button.innerHTML = flagSVG('#FFFFFF');
        // update the counter
        mineCounter--;
        generateMineCounter();
        // and add it to the explored set
        explored.add(String([x, y]));
    // if it does have flag
    } else {
        // we remove it
        button.innerHTML = '';
        //update the counter
        mineCounter++;
        generateMineCounter();
        // and remove it from the explored set
        explored.delete(String([x, y]));
    };
    // a flag can be the last one, so we check for the win condition
    checkForWin();
};


// and that's it for the programation logic of minesweeper!
// However, there's a lot more going on to make it into a website
// but, it's the essential logic of it
// the nitty gritty implementation details aren't explained here,
// but once again, you can go peek at them on https://github.com/TheAxan/Minesweeper-website