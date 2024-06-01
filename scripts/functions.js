
export function getFieldSize() {
    let selection = document.querySelector(`input[name="gridSize"]:checked`);
    let size = selection ? Number(selection.value) : 0;
    return size;
}

export function createFieldArray(size) {
    return new Array(size).fill(0).map(() => new Array(size).fill(0));
}

export function showField(fieldArray) {
    let field = ``;
    for (let i = 0; i < fieldArray.length; i++) {
        field += `<tr>`;
        for (let j = 0; j < fieldArray.length; j++) {
            field += `<td><button class="fieldBtn" id="b-${i}-${j}"></button></td>`;
        }
        field += `</tr>`;
    }
    return field;
}
export function showScore( scoreArr) {
    let type2 = document.querySelector(`#type2`);
    let type3 = document.querySelector(`#type3`);
    let type4 = document.querySelector(`#type4`);
    let type5 = document.querySelector(`#type5`);
    type2.innerHTML = scoreArr[0];
    type3.innerHTML = scoreArr[1];
    type4.innerHTML = scoreArr[2];
    type5.innerHTML = scoreArr[3];
}
export function checkIfShip(x, y, fieldArray) {
    let cell = document.querySelector(`#b-${x}-${y}`);
    if (fieldArray[x][y] === 1) {
        cell.style.backgroundColor = `red`;
        fieldArray[x][y] = 2;
        updateScore(fieldArray);
    }
    if (fieldArray[x][y] === 0 || fieldArray[x][y] === 3) {
        cell.style.backgroundColor = `blue`;
    }
}
export function updateScore(fieldArray) {
    let countType2 = 0, countType3 = 0, countType4 = 0, countType5 = 0;
    let counted = [];
    for (let i = 0; i < fieldArray.length; i++) {
        for (let j = 0; j < fieldArray[0].length; j++) {
            if (fieldArray[i][j] === 1) {
                let shipClass = document.querySelector(`#b-${i}-${j}`).className;
                let shipSize = shipClass.charAt(17);
                let shipNum = shipClass.substring(26);
                let shipCharacteristics = `size:${shipSize}-num:${shipNum}`;
                if (!counted.includes(shipCharacteristics)) {
                    counted.push(shipCharacteristics);
                    if (shipSize === `2`) countType2++;
                    if (shipSize === `3`) countType3++;
                    if (shipSize === `4`) countType4++;
                    if (shipSize === `5`) countType5++;
                }
            }
        }
    }
    return [countType2, countType3, countType4, countType5];
}

export function initShips(fieldArray, numOf2, numOf3, numOf4, numOf5) {
    const SIZE_OF_2 = 2, SIZE_OF_3 = 3, SIZE_OF_4 = 4, SIZE_OF_5 = 5;
    let countPlaced2 = 0;
    let countPlaced3 = 0;
    let countPlaced4 = 0;
    let countPlaced5 = 0;
    countPlaced5 = addShips(fieldArray, SIZE_OF_5, numOf5);
    countPlaced4 = addShips(fieldArray, SIZE_OF_4, numOf4);
    countPlaced3 = addShips(fieldArray, SIZE_OF_3, numOf3);
    countPlaced2 = addShips(fieldArray, SIZE_OF_2, numOf2);
    if (countPlaced2 < numOf2 || countPlaced3 < numOf3 || countPlaced4 < numOf4 || countPlaced5 < numOf5) {
        let popUp = document.querySelector(`#pop-up`);
        let p = `<button id="closeBtn"></button><p>`;
        if (countPlaced2 < numOf2) {
            if (countPlaced2 === 0)
                p += `Could not fit any Battleship size of 2<br>`;
            else
                p += `Could fit only ${countPlaced2} Battleships of size of 2<br>`;
        }
        if (countPlaced3 < numOf3) {
            if (countPlaced3 === 0)
                p += `Could not fit any Battleship size of 3<br>`;
            else
                p += `Could fit only ${countPlaced3} Battleships of size of 3<br>`;
        }
        if (countPlaced4 < numOf4) {
            if (countPlaced4 === 0)
                p += `Could not fit any Battleship size of 4<br>`;
            else
                p += `Could fit only ${countPlaced4} Battleships of size of 4<br>`;
        }
        if (countPlaced5 < numOf5) {
            if (countPlaced5 === 0)
                p += `Could not fit any Battleship size of 5<br>`;
            else
                p += `Could fit only ${countPlaced5} Battleships of size of 5<br>`;
        }
        p += `</p>`;
        popUp.innerHTML = p;
        popUp.style.display = `block`;
        let closeBtn = document.querySelector(`#closeBtn`);
        closeBtn.addEventListener(`click`, function () {
            popUp.style.display = `none`;
        });
    }
    updateScore(fieldArray, countPlaced2, countPlaced3, countPlaced4, countPlaced5);
}

function addShips(fieldArray, length, numOfShips) {
    let countPlaced = 0;
    let positions = shuffleShipPositions(createPositions(fieldArray.length, fieldArray[0].length, length));
    for (let position of positions) {
        if (numOfShips <= 0)
            break;
        let [startRow, startCol, isVertical] = position;
        if (isVertical && canPlaceVertical(fieldArray, startRow, startCol, length)) {
            countPlaced++;
            for (let i = 0; i < length; i++) {
                fieldArray[startRow + i][startCol] = 1;
                document.querySelector(`#b-${startRow + i}-${startCol}`).classList.add(`shipSize${length}-shipNum${countPlaced}`);
            }
            createShipBorder(fieldArray, startRow, startCol, length, isVertical);
            numOfShips--;
        }
        else if (!isVertical && canPlaceHorizontal(fieldArray, startRow, startCol, length)) {
            countPlaced++;
            for (let i = 0; i < length; i++) {
                fieldArray[startRow][startCol + i] = 1;
                document.querySelector(`#b-${startRow}-${startCol + i}`).classList.add(`shipSize${length}-shipNum${countPlaced}`);
            }
            createShipBorder(fieldArray, startRow, startCol, length, isVertical);
            numOfShips--;
        }
    }
    return countPlaced;
}
function createPositions(arrLength, arr0Length, length) {
    let positions = [];
    //adding horizontal positions to the array
    for (let i = 0; i < arrLength; i++) {
        for (let j = 0; j <= arr0Length - length; j++) {
            positions.push([i, j, false]);
        }
    }
    //adding vertical positions to the array
    for (let i = 0; i <= arrLength - length; i++) {
        for (let j = 0; j < arr0Length; j++) {
            positions.push([i, j, true]);
        }
    }
    return positions;
}
function shuffleShipPositions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function createShipBorder(fieldArray, startRow, startCol, length, isVertical) {
    if (isVertical) {
        for (let i = 0; i < length; i++) {
            if (startCol > 0) {
                fieldArray[startRow + i][startCol - 1] = 3;
                if (startRow > 0) fieldArray[startRow - 1][startCol - 1] = 3;
                if (startRow + length < fieldArray.length) fieldArray[startRow + length][startCol - 1] = 3;
            }
            if (startCol + 1 < fieldArray[0].length) {
                fieldArray[startRow + i][startCol + 1] = 3;
                if (startRow > 0) fieldArray[startRow - 1][startCol + 1] = 3;
                if (startRow + length < fieldArray.length) fieldArray[startRow + length][startCol + 1] = 3;
            }
            if (startRow + length < fieldArray.length) fieldArray[startRow + length][startCol] = 3;
            if (startRow - 1 >= 0) fieldArray[startRow - 1][startCol] = 3;
        }
    }
    else {
        for (let i = 0; i < length; i++) {
            if (startRow > 0) {
                fieldArray[startRow - 1][startCol + i] = 3;
                if (startCol - 1 >= 0) fieldArray[startRow - 1][startCol - 1] = 3;
                if (startCol + length < fieldArray[0].length) fieldArray[startRow - 1][startCol + length] = 3;
            }
            if (startRow + 1 < fieldArray.length) {
                fieldArray[startRow + 1][startCol + i] = 3;
                if (startCol - 1 >= 0) fieldArray[startRow + 1][startCol - 1] = 3;
                if (startCol + length < fieldArray[0].length) fieldArray[startRow + 1][startCol + length] = 3;
            }
            if (startCol > 0) fieldArray[startRow][startCol - 1] = 3;
            if (startCol + length < fieldArray[0].length) fieldArray[startRow][startCol + length] = 3;
        }
    }
}

function canPlaceVertical(fieldArray, startRow, startCol, shipSize) {
    for (let i = 0; i < shipSize; i++) {
        if (fieldArray[startRow + i][startCol] !== 0) {
            return false;
        }
    }
    return true;
}

function canPlaceHorizontal(fieldArray, startRow, startCol, shipSize) {
    for (let i = 0; i < shipSize; i++) {
        if (fieldArray[startRow][startCol + i] !== 0) {
            return false;
        }
    }
    return true;
}

export function getNumOfShips(id) {
    let value = document.querySelector(`#size${id}`).value;
    return value;
}