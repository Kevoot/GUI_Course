function createBoard() {
    let str = '<div id="container"><div class="col-md-12">';
    for (let i = 0; i < BOARD_WIDTH; i++) {
        if (i === 5 || i === 10) {
            str += '<div class="holder double-holder boardHolder" id="holder' + i + '"></div>';
        }
        else {
            str += '<div class="holder boardHolder" id="holder' + i + '"></div>';
        }
    }
    str += '</div>'

    return str;
}

const BOARD_WIDTH = 15;

let gameBoard = [];

let boxes = [];
let tileBag = [];
let curBox;
let curDraggingLetter = "";
let curScore;

function init() {
    createTileBag();
    createGameBoard();
    document.getElementById("gameboard").innerHTML = createBoard();

    boxes = document.getElementsByClassName('box');
    for (let box of boxes) {
        box.addEventListener("dragstart", handleDragStart);
        box.addEventListener("dragend", handleDragEnd);
        $(box).attr("letter", "");
    }

    const containers = document.getElementsByClassName('holder')

    for (const container of containers) {
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("dragenter", handleDragEnter);
        container.addEventListener("dragleave", handleDragLeave);
        container.addEventListener("drop", HandleDrop);
    }

    fillPlayerTiles();
    curScore = 0;
}

function createTileBag() {
    for (let element in tileConfig) {
        for (let i = 0; i < tileConfig[element].count; i++) {
            tileBag.push(element);
        }
    }
}

function createGameBoard() {
    for (let i = 0; i < BOARD_WIDTH; i++) {
        // Set slots 5 and 10 as double word score
        let multiplier = false;
        if (i == 5 || i == 10) {
            multiplier = true;
        }

        gameBoard.push({ currentLetter: undefined, previouslySet: false, multiplier: multiplier });
    }
}

function handleDragStart(evt) {
    this.className += " held"

    setTimeout(() => this.className = "invisible", 0);
    curBox = this;

    let holderNumber = parseInt(evt.target.id.substring(6));
    if (!isNaN(holderNumber)) {
        gameBoard[holderNumber].currentLetter = undefined;
    }
}

function handleDragEnd(evt) {
    this.className = "box"
}

function handleDragOver(e) {
    e.preventDefault()
}

function handleDragEnter(e) {
    if (curBox !== undefined && this.children.length < 1) {
        e.preventDefault()
        this.className += " hovered"
    }
}

function handleDragLeave(evt) {
    // If the holder already has something in it, don't allow.
    if (this.children.length > 0) {
        return;
    }

    holderNumber = parseInt(evt.target.id.substring(6));

    // If this holder is a board space and is a double word tile then
    // use the separate class
    if (!isNaN(holderNumber)) {
        if (holderNumber === 5 || holderNumber === 10) {
            this.className = "double-holder";
        }
        else {
            this.className = "holder";
        }
    }
    else {
        this.className = "holder";
    }
}

function HandleDrop(evt) {
    // If the holder already has something in it, don't allow.
    if (this.children.length > 0) {
        return;
    }

    this.append(curBox);
    curBox.className = "box";

    if (curBox !== undefined) {
        let holderNumber;

        if (evt.target.id.charAt(0) === 'p') {
            this.className = "holder"
            holderNumber = parseInt(evt.target.id.substring(12));
        }
        else {
            holderNumber = parseInt(evt.target.id.substring(6));

            // If this holder is a board space and is a double word tile then
            // use the separate class
            if (holderNumber === 5 || holderNumber === 10) {
                this.className = "double-holder";
            }
            else {
                this.className = "holder"
            }
        }

        gameBoard[holderNumber].currentLetter = $(curBox).attr("letter");
        curBox = undefined;
    }
}

function fillPlayerTiles() {
    boxes = document.getElementsByClassName('box');
    for (let box of boxes) {
        r = Math.floor(Math.random() * tileBag.length);
        let letter = tileBag.splice(r, 1)[0];
        box.style =
            "background-image: url('./img/Scrabble_Tile_" + letter + ".jpg'); background-size: cover;";
        $(box).attr("letter", letter);
    }
}

$(document).on('click', '#submit', () => {
    let startIndex = -1;
    let endIndex = -1;
    let resultWord = "";

    // Find the first populated entry
    for (let i = 0; i < BOARD_WIDTH; i++) {
        if (gameBoard[i].currentLetter && !gameBoard[i].previouslySet) {
            startIndex = i;
            break;
        }
    }

    // If index is still -1, no pieces have been placed
    if (startIndex < 0) {
        return;
    }
    else {
        // Scan until the last letter is found
        for (let i = startIndex; i < BOARD_WIDTH; i++) {
            if (gameBoard[i].currentLetter) {
                resultWord += gameBoard[i].currentLetter;
                endIndex = i;
            }
            else {
                break;
            }
        }

        // Do some error checking now, previously played words shouldn't be factored into this
        // This isn't strictly necessary when the board is a singular row, but in case it was
        // 2D, this would be necessary.
        if (endIndex !== (BOARD_WIDTH) - 1) {
            for (let i = endIndex + 1; i < BOARD_WIDTH; i++) {
                if (gameBoard[i].currentLetter && !gameBoard[i].previouslySet) {
                    handleTilesDisconnectedError();
                    return;
                }
            }
        }

        completeTurn(startIndex, endIndex);
    }
});

$(document).on('click', '#reroll', () => {
    dealTiles(true);
})

function completeTurn(start, end) {
    for (let i = start; i <= end; i++) {
        gameBoard[i].previouslySet = true;
        // Remove event handlers for that piece
        let holder = document.getElementById('holder' + i);
        let box = holder.children[0];

        holder.removeEventListener("dragover", handleDragOver);
        holder.removeEventListener("dragenter", handleDragEnter);
        holder.removeEventListener("dragleave", handleDragLeave);
        holder.removeEventListener("drop", HandleDrop);

        box.removeEventListener("dragstart", handleDragStart);
        box.removeEventListener("dragend", handleDragEnd);


    }
    updateScore(calculateWordScore(start, end));
    dealTiles();
}

function updateScore(num) {
    curScore = curScore + num;
    $('#score').html("Current Score: " + curScore);
}

function calculateWordScore(start, end) {
    let multiplierFlag = false;
    let wordTotal = 0;
    for (let i = start; i <= end; i++) {
        wordTotal += tileConfig[gameBoard[i].currentLetter].val;
        if (gameBoard[i].multiplier) {
            multiplierFlag = true;
        }
    }

    if (multiplierFlag) {
        wordTotal = wordTotal * 2;
    }

    return wordTotal;
}

function dealTiles(replace) {
    for (let i = 0; i < 7; i++) {
        let holder = document.getElementById('playerHolder' + i);
        if (replace) {
            holder.innerHTML = '';
        }
        if (holder.children.length < 1) {
            r = Math.floor(Math.random() * tileBag.length);
            let letter = tileBag.splice(r, 1)[0];
            let newDiv = document.createElement("div");
            newDiv.draggable = true;
            newDiv.setAttribute("letter", letter);
            $(newDiv).addClass("box");
            $(newDiv).css("background-image", "url('./img/Scrabble_Tile_" + letter + ".jpg')");
            $(newDiv).css("background-size", "cover");

            newDiv.addEventListener("dragstart", handleDragStart);
            newDiv.addEventListener("dragend", handleDragEnd);

            holder.appendChild(newDiv);
        }
    }
}

function handleSingleLetterError() {
    console.log("Can't play single letter words!");
}

function handleTilesDisconnectedError() {
    console.log("Tiles are disconnected, check your placement!");
}

function main() {
    init();
}

main();