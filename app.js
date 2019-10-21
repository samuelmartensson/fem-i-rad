let row = document.querySelectorAll('.board_row')
let body = document.querySelector('#field')

let isXturn = true;
let noWinner = true;

let turnText = document.querySelector('#players_turn')

let turnAmount = document.querySelector('#turn_amounts')
let turnCounter = 1;

let replayButton = document.querySelector('#replay')
let winnerText = document.querySelector('#winner_text')

let blockArr = []

let audioBlue = document.querySelector('#audio_blue')
let audioOrange = document.querySelector('#audio_orange')
let audioWin = document.querySelector('#audio_win')
audioBlue.volume = 0.5
audioOrange.volume = 0.5
audioWin.volume = 0.5

let muteButton = document.querySelector('#mute-button')

let size
let promptText = document.querySelector('#prompt-text')

let startButton = document.querySelector('#start').addEventListener('click', inputField)
let cancelGeneration = false

function inputField(){
    let iSize = document.querySelector('#input-field').value
    size = Math.floor(iSize)
    if ((size >= 5 || iSize.length === 0) && !cancelGeneration){
        if (size > 25 || iSize.length === 0){
            size = 25
        }
        generateBoard()
        cancelGeneration = true
        promptText.style.display = "none"
    }
    else if (!cancelGeneration){
        promptText.style.display = "block"
        promptText.style.backgroundColor = "red"
        promptText.textContent = "VALUE BETWEEN 5 AND 25 PLEASE"
    }
}

function generateBoard(){
    //Generating the board
    for (let j = 0; j < size; j++){
        
        let boardCols = document.createElement('div')
        boardCols.classList.add('board_row')
        body.appendChild(boardCols)

        for (let i = 0; i < size; i++) {
            let n = document.createElement('button')
            n.classList.add('aBlock')
            boardCols.appendChild(n)
            blockArr.push(n)
        }
    }
    let fieldSize = document.querySelector('#field_size')
    fieldSize.textContent = `${size}x${size}`
}

muteButton.addEventListener("click", function(event){
    
    if(audioWin.muted === true){
        unmutePage()
        muteButton.textContent = "🔊"
    }
    else{
        mutePage()
        muteButton.textContent = "🔈"
    }
})

function muteMe(elem) {
    elem.muted = true;
}
function unmuteMe(elem) {
    elem.muted = false;
}
function mutePage() {
    document.querySelectorAll("audio").forEach( elem => muteMe(elem) );
}
function unmutePage() {
    document.querySelectorAll("audio").forEach( elem => unmuteMe(elem) );
}

let played = false
function winAudioOneShot(){
    if (!played){
        audioWin.play()
        played = true
    }
}

function winConstants(){
    replayButton.style.position = "fixed"
    replayButton.style.bottom = "100px"
    winnerText.style.display = "inline-block"
    noWinner = false
}
function circleWinnerAlert(){
    winnerText.textContent = `⭕️ - VINNER`
    turnText.textContent = `⭕️ - VINNER`
    winAudioOneShot()
    winConstants()
    body.classList.add('board_row_anim_orange')
}
function crossWinnerAlert(){
    winnerText.textContent = `❌ - VINNER`
    turnText.textContent = `❌ - VINNER`
    winAudioOneShot()
    winConstants()
    body.classList.add('board_row_anim_blue')

    winnerText.style.borderTop = "2px solid blue"
    winnerText.style.borderBottom = "2px solid blue"
}

//FUNCTIONS TO SWITCH BLINKING COLOR ON HOVER
let blockButton
    function switchColorToBlue(){
        blockButton = document.querySelectorAll('.aBlock')
        for (let i = 0; i < blockButton.length; i++) {
            blockButton[i].classList.remove('aBlock')
            blockButton[i].classList.add('bBlock')
        }
    }
    function switchColorToOrange(){
        for (let i = 0; i < blockButton.length; i++) {
            blockButton[i].classList.remove('bBlock')
            blockButton[i].classList.add('aBlock')
        }
    }

replayButton.addEventListener("click", function(){
    location.reload()
})

//THIS EVENT LISTENER CONTROLS WHAT HAPPENS WHEN BUTTONS ARE CLICKED AND IF A PLAYER HAS A WIN CONDITION
document.addEventListener("click", function(event){
    if (event.target.tagName === 'BUTTON' && isXturn && event.target.textContent === "" && noWinner)
    {
        event.target.textContent = "⭕️"
        event.target.style.backgroundColor = "rgb(196, 127, 0, 0.5)"
        isXturn = false
        switchColorToBlue()
        audioOrange.play()
        turnAmount.textContent = "DRAG NR: " + turnCounter++
        turnText.textContent = "nästa: ❌"
        checkWinCondition()
    }
    else if (event.target.tagName === 'BUTTON' && !isXturn && event.target.textContent === "" && noWinner) 
    {
        event.target.textContent = "❌"
        event.target.style.backgroundColor = "rgb(91, 91, 255, 0.5)"
        isXturn = true
        switchColorToOrange()
        audioBlue.play()
        turnAmount.textContent = "DRAG NR: " + turnCounter++
        turnText.textContent = "nästa: ⭕️"
        checkWinCondition()
    }
})

function checkWinCondition(){
    //////////////////
    //WIN CONDITIONS//
    //////////////////
    
    //HORIZONTAL WIN CONDITION
    for (let i = 0; i < blockArr.length - 4; i++) {
        if (blockArr[i].textContent === blockArr[i + 1].textContent){
            if (blockArr[i + 1].textContent === blockArr[i + 2].textContent){
                if (blockArr[i + 2].textContent === blockArr[i + 3].textContent){
                    if (blockArr[i + 3].textContent === blockArr[i + 4].textContent && blockArr[i + 4].textContent !== ""){
                        if (blockArr[i + 4].textContent === "⭕️"){
                            circleWinnerAlert()
                        }
                        else{
                            crossWinnerAlert()
    }}}}}}

    //VERTICAL WIN CONDITION
    let b = size / 5
    for (let i = 0; i < blockArr.length - (20 * b); i++) {
        if (blockArr[i].textContent === blockArr[i + 5 * b].textContent){
            if (blockArr[i + 5 * b].textContent === blockArr[i + 10 * b].textContent){
                if (blockArr[i + 10 * b].textContent === blockArr[i + 15 * b].textContent){
                    if (blockArr[i + 15 * b].textContent === blockArr[i + 20 * b].textContent && blockArr[i + 20 * b].textContent !== ""){
                        if (blockArr[i + 20 * b].textContent === "⭕️"){
                            circleWinnerAlert()
                        }
                        else{
                            crossWinnerAlert()
    }}}}}}

    //DIAGONAL WIN CONDITION R-L
    let c = size + 1
    for (let i = 0; i < blockArr.length - (c * 4); i++) {
        if (blockArr[i].textContent === blockArr[i + c].textContent){
            if (blockArr[i + c].textContent === blockArr[i + c * 2].textContent){
                if (blockArr[i + c * 2].textContent === blockArr[i + c * 3].textContent){
                    if (blockArr[i + c * 3].textContent === blockArr[i + c * 4].textContent && blockArr[i + c * 4].textContent !== ""){
                        if (blockArr[i + c * 4].textContent === "⭕️"){
                            circleWinnerAlert()
                        }
                        else{
                            crossWinnerAlert()
    }}}}}}

    //DIAGONAL WIN CONDITION L-R
    let d = size - 1
    for (let i = 0; i < blockArr.length - (d * 4); i++) {
        if (blockArr[i].textContent === blockArr[i + d].textContent){
            if (blockArr[i + d].textContent === blockArr[i + d * 2].textContent){
                if (blockArr[i + d * 2].textContent === blockArr[i + d * 3].textContent){
                    if (blockArr[i + d * 3].textContent === blockArr[i + d * 4].textContent && blockArr[i + d * 4].textContent !== ""){
                        if (blockArr[i + d * 4].textContent === "⭕️"){
                            circleWinnerAlert()
                        }
                        else{
                            crossWinnerAlert()
    }}}}}}
}