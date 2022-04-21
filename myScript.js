let height = 10, width =10;


let output = [];

let sweep_action = 'onclick';

let flag_action = 'oncontextmenu';

for (let y = 0; y <= height; y++) {
    let row = [];
    for (let x = 0; x <= width; x++) {
        row.push(
            `<button type='button' ${sweep_action}='sweep(${x}, ${y})' ${flag_action}='flag(${x}, ${y})'></button>`
        );
    };
    row.push('<br>');
    output.push(row.join(''));
};
output = output.join('');


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};


let mineField = new Array(height)
    .fill(null)
    .map(
        () => Array(width).fill(0)
    );

let fillRatio = 0.2;

for (let placed = 0; placed <= height * width * fillRatio;) {
    let x = getRandomInt(0, width);
    let y = getRandomInt(0, height);
    if (mineField[y][x] < 9) {
        mineField[y][x] = 9;
        for (let [j, i] of [[-1, -1], [-1, 0], [-1, 1], 
                                                [0, -1], [0, 1], 
                                                [1, -1], [1, 0], [1, 1]]) {
            if (-1 < y+j && y+j < height && -1 < x+i && x+i < width) {
                mineField[y+j][x+i] += 1;
            };
        };
        placed++;
    };
};


document.getElementById('array').innerHTML = output;
