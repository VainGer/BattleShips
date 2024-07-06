import { globals } from "./vars.js";

export function main() {
    checkInput();
    let startBtn = document.querySelector(`#startGame`);
    startBtn.addEventListener(`click`, startGame);
}
function startGame(event) {
    setFieldSize();
    createFieldArr();
    if (!setNumOfShips()) return;
    createFieldTbl();
    placeAllShips();
    updateScore();
    let cells = document.querySelectorAll(`#gameField table td`);
    cells.forEach(cell => {
        cell.addEventListener(`click`, hitTheShip);
    })
}
function setFieldSize() {
    let selectedRadio = document.querySelector(`input[name="fieldSize"]:checked`);
    let radioBtns = document.querySelectorAll(`#fieldSize input`);
    globals.battleFieldArr = new Array(selectedRadio ? Number(selectedRadio.value) : 0);
    radioBtns.forEach(radioBtn => {
        radioBtn.addEventListener(`change`, () => {
            globals.battleFieldArr = new Array(Number(radioBtn.value));
        });
    });
}
function checkInput() {
    let inputArr = document.querySelectorAll(`#numOfShips input`);
    let eventArr = [`change`, `keyup`];
    inputArr.forEach(input => {
        eventArr.forEach(event => {
            input.addEventListener(event, () => {
                if (isNaN(input.value) || Number(input.value < 0)) {
                    alert(`Enter a positive number in number of ships field`);
                    input.value = ``;
                    return;
                }
            })
        })
    });
}
function setNumOfShips() {
    let inputArr = document.querySelectorAll(`#numOfShips input`);
    for (let i = 0, j = 2; i < inputArr.length; i++, j++) {
        globals.numOfShips[i] = document.querySelector(`#type${j}Amount`).value;
    }
    if (globals.numOfShips.some((num) => num > 0)) {
        return true;
    }
    alert(`You have to place at least one ship to start the game`);
    return false;
}

function createFieldArr() {
    for (let i = 0; i < globals.battleFieldArr.length; i++) {
        globals.battleFieldArr[i] = new Array(globals.battleFieldArr.length).fill(0);
    }
}

function createFieldTbl() {
    let fieldTbl = ``;
    for (let i = 0; i < globals.battleFieldArr.length; i++) {
        fieldTbl += `<tr>`;
        for (let j = 0; j < globals.battleFieldArr[i].length; j++) {
            fieldTbl += `<td id="r${i}-c${j}"></td>`;
        }
        fieldTbl += `</tr>`;
    }
    document.querySelector(`#gameTbl`).innerHTML = fieldTbl;
}

function createShipPositions(size) {
    let positions = new Array();
    for (let i = 0; i < globals.battleFieldArr.length - size; i++) {
        for (let j = 0; j < globals.battleFieldArr[i].length; j++) {
            positions.push([i, j, true]);
        }
    }
    for (let i = 0; i < globals.battleFieldArr.length; i++) {
        for (let j = 0; j < globals.battleFieldArr[i].length - size; j++) {
            positions.push([i, j, false]);
        }
    }
    return shufflePositions(positions);
}

function shufflePositions(positionsArr) {
    for (let i = 0; i < positionsArr.length; i++) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = positionsArr[i];
        positionsArr[i] = positionsArr[j];
        positionsArr[j] = temp;
    }
    return positionsArr;
}

function placeAllShips() {
    let placedArr = new Array(4);
    for (let i = 0; i < globals.numOfShips.length; i++) {
        let positions;
        switch (i) {
            case (0):
                positions = createShipPositions(2);
                placedArr[0] = placeShips(positions, 2, globals.numOfShips[i]);
                break;
            case (1):
                positions = createShipPositions(3);
                placedArr[1] = placeShips(positions, 3, globals.numOfShips[i]);
                break;
            case (2):
                positions = createShipPositions(4);
                placedArr[2] = placeShips(positions, 4, globals.numOfShips[i]);
                break;
            case (3):
                positions = createShipPositions(5);
                placedArr[3] = placeShips(positions, 5, globals.numOfShips[i]);
                break;
        }
    }
    let allShipsPlaced = true;
    for (let i = 0; i < placedArr.length; i++) {
        if (placedArr[i] < globals.numOfShips[i]) {
            allShipsPlaced = false;
            i = placedArr.length;
        }
    }
    if (!allShipsPlaced) notAllShipsPlaced(placedArr[0], placedArr[1], placedArr[2], placedArr[3]);
    globals.numOfShips = placedArr;
}

function placeShips(positionsArr, size, numOfShips) {
    let placed = 0;
    for (let i = 0; i < numOfShips; i++) {
        for (let k = 0; k < positionsArr.length && i < numOfShips; k++) {
            let [startRow, startCol, isVertical] = positionsArr[k];
            if (isVertical && canPlaceVertical(startRow, startCol, size)) {
                placeShipVertical(startRow, startCol, size);
                i++;
                placed++;
            }
            else if (!isVertical && canPlaceHorizontal(startRow, startCol, size)) {
                placeShipHorizontal(startRow, startCol, size);
                i++;
                placed++;
            }
            // if (k + 1 === positionsArr.length) i = numOfShips;
        }
    }
    return placed;
}

function placeShipHorizontal(startRow, startCol, size) {
    for (let i = 0; i < size; i++) {
        globals.battleFieldArr[startRow][startCol + i] = [globals.shipId, size];
        let td = document.querySelector(`#r${startRow}-c${startCol + i}`);
        td.style.backgroundColor = `red`;
    }
    globals.shipId++;
    createHorizontalBorder(startRow, startCol, size);
}
function placeShipVertical(startRow, startCol, size) {
    for (let i = 0; i < size; i++) {
        globals.battleFieldArr[startRow + i][startCol] = [globals.shipId, size];
        let td = document.querySelector(`#r${startRow + i}-c${startCol}`);
        td.style.backgroundColor = `red`;
    }
    globals.shipId++;
    createVerticalBorder(startRow, startCol, size)
}

function createHorizontalBorder(startRow, startCol, size) {
    for (let i = 0; i < size; i++) {
        if (startRow > 0) globals.battleFieldArr[startRow - 1][startCol + i] = -1;
        if (startRow + 1 < globals.battleFieldArr.length) globals.battleFieldArr[startRow + 1][startCol + i] = -1;
    }
    if (startRow > 0) {
        if (startCol - 1 >= 0) globals.battleFieldArr[startRow - 1][startCol - 1] = -1;
        if (startCol + size < globals.battleFieldArr[startRow].length) globals.battleFieldArr[startRow - 1][startCol + size] = -1;
    }
    if (startRow + 1 < globals.battleFieldArr.length) {
        if (startCol + size < globals.battleFieldArr[startRow + 1].length) globals.battleFieldArr[startRow + 1][startCol + size] = -1;
        if (startCol - 1 >= 0) globals.battleFieldArr[startRow + 1][startCol - 1] = -1;
    }
    if (startCol - 1 >= 0) globals.battleFieldArr[startRow][startCol - 1] = -1;
    if (startCol + size < globals.battleFieldArr[startRow].length) globals.battleFieldArr[startRow][startCol + size] = -1;
}

function createVerticalBorder(startRow, startCol, size) {
    for (let i = 0; i < size; i++) {
        if (startCol - 1 >= 0) globals.battleFieldArr[startRow + i][startCol - 1] = -1;
        if (startCol + 1 < globals.battleFieldArr[i].length) globals.battleFieldArr[startRow + i][startCol + 1] = -1;
    }
    if (startCol > 0) {
        if (startRow > 0) globals.battleFieldArr[startRow - 1][startCol - 1] = -1;
        if (startRow + size < globals.battleFieldArr.length) globals.battleFieldArr[startRow + size][startCol - 1] = -1;
    }
    if (startCol + 1 < globals.battleFieldArr[startRow].length) {
        if (startRow > 0) globals.battleFieldArr[startRow - 1][startCol + 1] = -1;
        if (startRow + size < globals.battleFieldArr.length) globals.battleFieldArr[startRow + size][startCol + 1] = -1;
    }
    if (startRow > 0) globals.battleFieldArr[startRow - 1][startCol] = -1;
    if (startRow + size < globals.battleFieldArr.length) globals.battleFieldArr[startRow + size][startCol] = -1;
}

function canPlaceHorizontal(startRow, startCol, size) {
    for (let i = 0; i < size; i++) {
        if (globals.battleFieldArr[startRow][startCol + i] !== 0) return false;
    }
    return true;
}

function canPlaceVertical(startRow, startCol, size) {
    for (let i = 0; i < size; i++) {
        if (globals.battleFieldArr[startRow + i][startCol] !== 0) return false;
    }
    return true;
}

function hitTheShip(event) {
    let td = event.target;
    let tdId = td.id;
    tdId = tdId.split(`-`);
    let [row, col] = [tdId[0].substring(1), tdId[1].substring(1)];
    if (globals.battleFieldArr[row][col][0] && !td.classList.contains(`destroyed`)) {
        td.style.backgroundColor = `blue`;
        td.classList.add(`damaged`, `n${globals.battleFieldArr[row][col][0]}`);
        shipIsDestroyed(td, row, col)
    }
    else if (!globals.battleFieldArr[row][col][0]) {
        td.style.backgroundColor = `green`;
        onClickEffects(`miss`);
    }
}

function notAllShipsPlaced(ships2, ships3, ships4, ships5) {
    let p = document.querySelector(`#message p`);
    p.innerHTML = ``;
    let div = document.querySelector(`#message`);
    let closeBtn = document.querySelector(`#closeDiv`);
    p.innerHTML = `Not all ships placed due to high number of ships provided<br><br><br><br>`;
    p.innerHTML += `Ships size 2 placed: ${ships2}<br> Ships size 3 placed: ${ships3}<br>
    Ships size 4 placed: ${ships4}<br>Ships size 5 placed: ${ships5}<br>`;
    div.style.display = `block`;
    closeBtn.addEventListener(`click`, () => {
        div.style.display = `none`;
    })
}

function updateScore() {
    for (let i = 0, j = 2; i < globals.numOfShips.length; i++, j++) {
        let td = document.querySelector(`#size${j}Td`);
        td.innerHTML = globals.numOfShips[i];
    }
}

function shipIsDestroyed(td, row, col) {
    let shipClass = td.classList[1];
    let tds = document.querySelectorAll(`.${shipClass}`);
    let shipSize = globals.battleFieldArr[row][col][1];
    if (tds.length === shipSize) {
        tds.forEach(thisTd => {
            thisTd.classList.remove(...thisTd.classList);
            thisTd.classList.add(`destroyed`);
        });
        switch (shipSize) {
            case (2):
                if (globals.numOfShips[0] > 0)
                    globals.numOfShips[0]--;
                break;
            case (3):
                if (globals.numOfShips[1] > 0)
                    globals.numOfShips[1]--;
                break;
            case (4):
                if (globals.numOfShips[2] > 0)
                    globals.numOfShips[2]--;
                break;
            case (5):
                if (globals.numOfShips[3] > 0)
                    globals.numOfShips[3]--;
                break;
        }
        updateScore();
        let continueGame = globals.numOfShips.some((num) => num > 0);
        if (continueGame) onClickEffects(`destroy`);
        else onClickEffects(`victory`);
    }
    else {
        onClickEffects(`hit`);
    }
}

function onClickEffects(scenario) {
    let destroyed = document.querySelector(`#destroyedSnd`);
    let hit = document.querySelector(`#hitSnd`);
    let miss = document.querySelector(`#missSnd`);
    let victorySnd = document.querySelector(`#victorySnd`);
    let audios = document.querySelectorAll(`audio`);
    audios.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
    });
    switch (scenario) {
        case (`miss`): miss.play();
            break;
        case (`hit`): hit.play();
            break;
        case (`victory`):
            victorySnd.play();
            showVictoryDisplay();
            break;
        case (`destroy`): destroyed.play();
            playExplosionGif();
            break;
    }
}

function playExplosionGif() {
    let gifSrc = `../assets/gifs/explosion.gif`;
    let gif = document.createElement(`img`);
    gif.src = gifSrc;
    gif.id = `explosion`;
    let gameTbl = document.querySelector(`#gameTbl`);
    let gameField = document.querySelector(`#gameField`);
    gameTbl.style.display = `none`;
    gameField.appendChild(gif);
    setTimeout(() => {
        gameField.removeChild(gif);
        gameTbl.style.display = `block`;
    }, 1.25 * 1000);
}

function showVictoryDisplay() {
    let btn = document.querySelector(`#restart`);
    let victoryDisplay = document.querySelector(`#victory`);
    victoryDisplay.style.display = `block`;
    btn.addEventListener(`click`, () => location.reload());
}