function createBoard() {
    let boardStr = "";
    for (let j = 0; j < BOARD_HEIGHT; j++) {
    let str = '<div id="container"><div class="col-md-12">';
    for (let i = 0; i < BOARD_WIDTH; i++) {
            str += '<div class="holder boardHolder" id="holder' + i + '"></div>';
    }
    str += '</div></div>'
    boardStr += str;
}
    return boardStr;
}

const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 2;

let gameBoard = [];

let boxes = [];
let tileBag = [];
let curBox;
let curDraggingLetter = "";

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
}

function createTileBag() {
    for (let element in tileConfig) {
        for (let i = 0; i < tileConfig[element].count; i++) {
            tileBag.push(element);
        }
    }
}

function createGameBoard() {
    for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
        gameBoard.push({ currentLetter: undefined, previouslySet: false });
    }
}

function handleDragStart(evt) {
    this.className += " held"

    setTimeout(() => this.className = "invisible", 0);
    curBox = this;
}

function handleDragEnd(evt) {
    this.className = "box"
}

function handleDragOver(e) {
    e.preventDefault()
}

function handleDragEnter(e) {
    if (curBox !== undefined) {
        e.preventDefault()
        this.className += " hovered"
    }
}

function handleDragLeave(evt) {
    this.className = "holder"
}

function HandleDrop(evt) {
    if (curBox !== undefined) {
        this.className = "holder"
        this.append(curBox);
        curBox.className = "box";
        let holderNumber;
        if (evt.target.id.charAt(0) === 'p') {
            holderNumber = evt.target.id.substring(12);
        }
        else {
            holderNumber = evt.target.id.substring(6);
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
        box.style  = 
            "background-image: url('./img/Scrabble_Tile_" + letter + ".jpg'); background-size: cover;";
        $(box).attr("letter", letter);
    }
}

$(document).on('click', '#submit', () => {
    let startIndex = -1;
    let endIndex = -1;
    let resultWord = "";

    // Find the first populated entry
    for (let i = 0; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
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
        for (let i = startIndex; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
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
        if (endIndex !== (BOARD_WIDTH * BOARD_HEIGHT) - 1) {
            for (let i = endIndex + 1; i < BOARD_WIDTH * BOARD_HEIGHT; i++) {
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
    dealTiles();
}

function dealTiles(replace) {
    for (let i = 0; i < 7; i++) {
        let holder = document.getElementById('playerHolder' + i);
        if(replace) {
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