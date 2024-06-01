import { getFieldSize, createFieldArray, showField, checkIfShip, initShips, getNumOfShips, showScore, updateScore } from "./functions.js";
let startBtn = document.querySelector(`#start-game`);
let field;
let explosionVid = document.querySelector(`#explosionVid`);
startBtn.addEventListener(`click`, function () {
    field = createFieldArray(getFieldSize());
    document.querySelector(`#game-board`).innerHTML = showField(field);
    let ships2 = getNumOfShips(2);
    let ships3 = getNumOfShips(3);
    let ships4 = getNumOfShips(4);
    let ships5 = getNumOfShips(5);
    if (isNaN(ships2) || isNaN(ships3) || isNaN(ships4) || isNaN(ships5) || ships2 < 0 || ships3 < 0 || ships4 < 0 || ships5 < 0) {
        alert(`Invalid value for number of ships, please try positive numbers`);
        location.reload();
    }
    initShips(field, ships2, ships3, ships4, ships5);
    showScore(updateScore(field));
    let inintialScore = updateScore(field);
    let fieldBtns = document.querySelectorAll(`.fieldBtn`);
    for (let i = 0; i < fieldBtns.length; i++) {
        fieldBtns[i].addEventListener(`click`, function () {
            let rowAndCol = fieldBtns[i].id.split(`-`);
            checkIfShip(parseInt(rowAndCol[1]), parseInt(rowAndCol[2]), field);
            showScore(updateScore(field));
            let newScore = updateScore(field);
            for (i = 0; i < inintialScore.length; i++) {
                if (inintialScore[i] !== newScore[i]) {
                    explosionVid.style.display = `block`;
                    explosionVid.play();
                    inintialScore[i] = newScore[i];
                }
            }
        });
    }
    explosionVid.addEventListener(`ended`, function () {
        explosionVid.style.display = `none`;
    });
    //loop through the board to check values
    // for (let i = 0; i < field.length; i++) {
    //     for (let j = 0; j < field[i].length; j++) {
    //         checkIfShip(i, j, field);
    //     }
    // }
});


