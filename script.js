'use strict'
//to do: victory screen (all non-bomb cells are clicked)
//adjust click count according to difficulty
//


const BOMB = '💣'
const EMPTY = ' '

var gClickCount = 50
var gGame = {
    cellsShown: 0,
    isOn: false,
    difficulty: 'easy',
    isFirstClick: true,
    flagCount: 0
}
var gSize = 4
var gBoard
const gDifficulties = {
    easy: { bombs: 2 },
    medium: { bombs: 4 },
    hard: { bombs: 6 },
}

function onGameInit() {
    gBoard = createBoard()
    renderBoard(gBoard)
    renderBoard(gBoard)
    gGame.isOn = true
}

function createBoard() {
    var board = []
    for (var i = 0; i < gSize; i++) {
        board[i] = []
        for (var j = 0; j < gSize; j++) {
            board[i][j] = { isBomb: false, isFlag: false, isRevealed: false }

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
            strHtml += `<td class="${className}" oncontextmenu="onSetFlag(event ,${i} ,${j})" onclick="onCellClicked(${i}, ${j})"></td>`
        }
        strHtml += `</tr>`
    }
    const elMat = document.querySelector('.game-board')
    elMat.innerHTML = strHtml
    elMat.style.width = '350px'
    elMat.style.height = '350px'
    elMat.style.margin = 'auto'

}




function renderBombLocations(i, j) {
    const bombsCount = gDifficulties[gGame.difficulty].bombs
    const locations = []

    while (locations.length < bombsCount) {
        const location = { i: getRandomIntInclusive(0, gSize - 1), j: getRandomIntInclusive(0, gSize - 1) }
        if (location.i === i && location.j === j) continue
        const isExist = locations.some(currLocation => currLocation.i === location.i && currLocation.j === location.j)
        if (isExist) continue
        locations.push(location)
    }
    locations.forEach(location => gBoard[location.i][location.j].isBomb = true)

    // console.table(gBoard)
    // console.log(locations)
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
    restartGame()
}

function onCellClicked(i, j) {
    if (gBoard[i][j].isFlag || gBoard[i][j].isRevealed) return
    if (gGame.isFirstClick) {
        gGame.isFirstClick = false
        renderBombLocations(i, j)
    }
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    const elCell = document.querySelector(`.cell-${i}-${j}`)
    if (cell.isBomb) {
        onBombClick(elCell)
        return
    } else {
        elCell.classList.add('not-bomb')
        gClickCount--
        const elMeter = document.querySelector('.click-meter span')
        elMeter.innerHTML = gClickCount
        revealCell(i, j, elCell)
        gBoard[i][j].isRevealed = true
    }
}

function restartGame() {
    gClickCount = 50
    const elMeter = document.querySelector('.click-meter span')
    elMeter.innerHTML = gClickCount
    gGame.isOn = true
    gGame.isFirstClick = true
    document.querySelector('.reset-btn').innerHTML = '😊'
    document.querySelector('.result-text').innerHTML = ''
    gGame.flagCount = 0
    onGameInit()

}

function onBombClick(elCell) {
    elCell.innerHTML = BOMB
    elCell.classList.add('bomb')
    document.querySelector('.result-text').innerHTML = 'You Lost!'
    gGame.isOn = false
    const elMeter = document.querySelector('.click-meter span')
    document.querySelector('.reset-btn').innerHTML = '💀'
    elMeter.innerHTML = '--'
}

function revealCell(rowIdx, colIdx, elCell) {
    var bombCount = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue
            if (i === rowIdx && j === colIdx) continue
            if (gBoard[i][j].isBomb) {
                bombCount++
            }
        }
    }
    if (!bombCount) return
    elCell.innerHTML = bombCount
}
function onSetFlag(ev, i, j) {
    ev.preventDefault()
    if (gGame.flagCount === gDifficulties[gGame.difficulty].bombs) return
    if (gBoard[i][j].isRevealed) return
    gBoard[i][j].isFlag = true
    ev.target.innerHTML = '🚩'
    gGame.flagCount++
}