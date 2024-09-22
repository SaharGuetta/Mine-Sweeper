'use strict'

const BOMB = '💣'
const EMPTY = ' '

var gGame = {
    cellsShown: 0,
    isOn: false,
    difficulty: 'easy',
}
var gSize = 4
var gBoard
const gDifficulties = {
    easy: { bombs: 2},
    medium: { bombs: 4},
    hard: { bombs: 6},
}

function onGameInit() {
    gBoard = createBoard()
    renderBoard(gBoard)
    renderBombs()

}

function createBoard() {
    var board = []
    for (var i = 0; i < gSize; i++) {
        board[i] = []
        for (var j = 0; j < gSize; j++) {
            board[i][j] = { isBomb: false }
        }
    } return board
}



function renderBoard(board) {
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        const row = board[i]
        strHtml += `<tr>`
        for (var j = 0; j < row.length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHtml += `<td class="${className}" onclick="onCellClicked(${i}, ${j})"></td>`
        }
        strHtml += `</tr>`
    }
    const elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
    elMat.style.width = '350px'
    elMat.style.height = '350px'
    elMat.style.margin = 'auto'
}


function onCellClicked(i, j) {
    // for (var i = 0; i < gBoard.length; i++) {
    //     for (var j = 0; j < gBoard[0].length; j++){

    //     }
    // }
    console.log(gBoard[i][j])
}

function renderBombs() {
    const bombsCount = gDifficulties[gGame.difficulty].bombs
    const locations = []
    locations.push({ i: getRandomIntInclusive(0, gSize - 1), j: getRandomIntInclusive(0, gSize - 1) })
    console.log(locations);

    while (locations.length < bombsCount) {
        const location = { i: getRandomIntInclusive(0, gSize - 1), j: getRandomIntInclusive(0, gSize - 1) }
        const isExist = locations.some(currLocation => currLocation.i === location.i && currLocation.j === location.j)
        if (isExist) continue
        locations.push(location)
    }
    locations.forEach(location => gBoard[location.i][location.j].isBomb = true)
    console.table(gBoard)
    console.log(locations);


}

function changeDifficulty(difficulty) {
    gGame.difficulty = difficulty
    switch (difficulty) {
        case 'easy':
            gSize = 4
            break
        case 'medium':
            gSize = 5
            break
        case 'hard':
            gSize = 6
            break
    }
    onGameInit()
}