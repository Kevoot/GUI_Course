/**
 *	File: https://kevoot.github.io/GUI_Course/final/js/main.js
 *  Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 12/19/2018 3:34PM
 *  Description: The main idea here is to mirror changes between
 *               the visual elements being changed, and the gameBoard
 *               data structure so it will be easy to update scores and
 *               manipulate the data
 * 
 *  This file: Contains all of the jquery handlers, error handling, and 
 *             manipulation of the game board data structure itself. Also
 *             contained within is all of the page's initialization steps
 * 
 *  NOTE: No extra credit was attempted in this version, so only one row
 *        of tiles for the gameboard and no word checking
 */

const BOARD_WIDTH = 15;

// data model of the board's placed pieces, values, and status if it is played during current turn or not
let gameBoard = [];

// Bag of all tiles filled by tileConfig
let tileBag = [];

// Currently dragging box
let curBox;

// Running total score for current game
let curScore;

/**
 * initializes the set of useable tiles, the gameboard data structure, and adds listeners to boxes/holders
 */
function init() {
    createTileBag();
    createGameBoardData();
    document.getElementById("gameboard").innerHTML = createBoardDiv();

    let boxes = document.getElementsByClassName('box');
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

/**
 * Writes a new board into the container. Also adds two multiplier squares to the row
 */
function createBoardDiv() {
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

/**
 * iterates through each letter and pushes that number of tiles of that letter to the "bag"
 */
function createTileBag() {
    for (let element in tileConfig) {
        for (let i = 0; i < tileConfig[element].count; i++) {
            tileBag.push(element);
        }
    }
}

/**
 * Initializes the game board data structure and sets the locations for score multipliers
 */
function createGameBoardData() {
    for (let i = 0; i < BOARD_WIDTH; i++) {
        // Set slots 5 and 10 as double word score
        let multiplier = false;
        if (i == 5 || i == 10) {
            multiplier = true;
        }

        gameBoard.push({ currentLetter: undefined, previouslySet: false, multiplier: multiplier });
    }
}

/**
 * @summary Removes the value from the current holder in prepartion for placing in the new holder.
 * @param {DragEvent} evt item that is being dragged
 */
function handleDragStart(evt) {
    this.className += " held"

    setTimeout(() => this.className = "invisible", 0);
    curBox = this;
    let holderNumber = "";

    if (this.className.indexOf("holder") !== -1) {
        holderNumber = parseInt(evt.target.id.substring(6));
    }
    else {
        holderNumber = parseInt(evt.target.parentElement.id.substring(6));
    }

    if (!isNaN(holderNumber)) {
        gameBoard[holderNumber].currentLetter = undefined;
    }
}

/**
 * @summary Removes the value from the current holder in prepartion for placing in the new holder.
 * @param {DragEvent} evt item that is being dragged
 */
function handleDragEnd(evt) {
    this.className = "box"
}

/**
 * @summary Stops unnecessary events from firing
 * @param {DragEvent} evt item that is being dragged
 */
function handleDragOver(evt) {
    evt.preventDefault()
}

/**
 * @summary Swaps the class of a holder to visually show the tile can be placed at that location
 * @param {DragEvent} evt item that is being dragged
 */
function handleDragEnter(evt) {
    if (curBox !== undefined && this.children.length < 1) {
        evt.preventDefault()
        this.className += " hovered"
    }
}

/**
 * @summary Swaps the class if the tile wasn't dropped back to the default visual status
 * @param {DragEvent} evt item that is being dragged
 */
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

/**
 * @summary Depending on whether or not it's the player rack or the gameboard, sets the class
 *          to update the visual status and then write the letter to the gameboard location
 * @param {DragEvent} evt item that is being dragged
 */
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

/**
 * @summary Randomly removes tiles from the tileBag and places it on the player's rack
 */
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

// On submit, find the first new letter, append leading letters from previous moves (if any), and find the
// end markers. If the player has placed pieces with a gap, throws and error and doesn't submit move for scoring
$(document).on('click', '#submit', () => {
    let startIndex = -1;
    let endIndex = -1;

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
        // Adjust to include anything attached directly to the front
        if (startIndex > 0 && gameBoard[startIndex - 1].currentLetter) {
            for (let i = startIndex - 1; i >= 0; i--) {
                if (gameBoard[i].currentLetter && gameBoard[i].previouslySet) {
                    startIndex = i;
                }
            }
        }

        // Scan until the last letter is found
        // No need to adjust here, it will accept if the piece was previously set
        for (let i = startIndex; i < BOARD_WIDTH; i++) {
            if (gameBoard[i].currentLetter) {
                endIndex = i;
            }
            else {
                break;
            }
        }

        // If there is a gap in pieces this round, throw an error
        if (endIndex !== (BOARD_WIDTH) - 1) {
            for (let i = endIndex + 1; i < BOARD_WIDTH; i++) {
                if (gameBoard[i].currentLetter && !gameBoard[i].previouslySet) {
                    handleTilesDisconnectedError();
                    return;
                }
            }
        }

        // If by this point we haven't hit any issues, we can clear any previous errors
        clearErrors();

        completeTurn(startIndex, endIndex);
    }
});

// Replaces all user tiles with new ones from the bag
$(document).on('click', '#reroll', () => {
    dealTiles(true);
    updateHistory("Replaced all tiles");
})

// Reinitializes all data structures and html elements to start a new game (except for the history textarea)
$(document).on('click', '#restart', () => {
    boxes = [];
    tileBag = [];
    gameBoard = [];
    curBox = undefined;
    curScore = 0;
    $('#score').html("Current Score: 0");

    init();
    updateHistory("Started a new game!");
})

/**
 * @summary Removes all event handlers for played areas so they cannot be manipulated in later turns. It then
 *          calculates new score and updates information in history text area
 * @param {number} start index of the start of the word
 * @param {number} end  index of the end of the word
 */
function completeTurn(start, end) {
    for (let i = start; i <= end; i++) {
        // Remove event handlers for that piece and holder
        let holder = document.getElementById('holder' + i);
        let box = holder.children[0];

        holder.removeEventListener("dragover", handleDragOver);
        holder.removeEventListener("dragenter", handleDragEnter);
        holder.removeEventListener("dragleave", handleDragLeave);
        holder.removeEventListener("drop", HandleDrop);

        box.removeEventListener("dragstart", handleDragStart);
        box.removeEventListener("dragend", handleDragEnd);
    }

    // Concat the word together
    let word = "";
    for (let i = start; i <= end; i++) {
        word += gameBoard[i].currentLetter;
    }


    let points = calculateWordScore(start, end);
    updateHistory("Played: " + word + " for " + points + " points");
    console.log("Played: " + word + " for " + points + " points");
    updateScore(points);
    dealTiles();

    // Make sure all slots in the gameboard are flagged as non-writeable now.
    for (let i = start; i <= end; i++) {
        gameBoard[i].previouslySet = true;
    }
}

/**
 * @summary Appends a string to the bottom of the history text area and scroll to the bottom
 * @param {string} str string to append to the bottom of the history text area
 */
function updateHistory(str) {
    // Now force the text area to scroll to the bottom
    var textarea = document.getElementById('historytext');
    textarea.value += '\n' + str;
    textarea.scrollTop = textarea.scrollHeight;
}

/**
 * @summary Updates the current running score and sets the html accordingly
 * @param {number} num number to add to the previous score 
 */
function updateScore(num) {
    curScore = curScore + num;
    $('#score').html("Current Score: " + curScore);
}

/**
 * @summary Calculates the full value of the played word and applies any multipliers
 * @param {number} start index of the start of the current word
 * @param {number} end  index of the end of the current word
 */
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

/**
 * @summary Replaces empty player slots with new tiles or replaces all of them based on the param
 * @param {boolean} replace Whether or not to replace all current player tiles or just fill the gaps
 */
function dealTiles(replace) {
    for (let i = 0; i < 7; i++) {
        let holder = document.getElementById('playerHolder' + i);
        if (replace) {
            holder.innerHTML = '';
        }
        if (holder.children.length < 1) {

            // Randomly grab a new piece
            r = Math.floor(Math.random() * tileBag.length);
            let letter = tileBag.splice(r, 1)[0];

            // Set attributes and classes
            let newDiv = document.createElement("div");
            newDiv.draggable = true;
            newDiv.setAttribute("letter", letter);
            $(newDiv).addClass("box");
            $(newDiv).css("background-image", "url('./img/Scrabble_Tile_" + letter + ".jpg')");
            $(newDiv).css("background-size", "cover");

            // Add event listeners for new piece and push into blank holder
            newDiv.addEventListener("dragstart", handleDragStart);
            newDiv.addEventListener("dragend", handleDragEnd);
            holder.appendChild(newDiv);
        }
    }
}

/**
 * @summary If there is a gap between tiles, inform the user to take action
 */
function handleTilesDisconnectedError() {
    $('#errortext').html("Tiles are disconnected, check your placement!");
}

/**
 * @summary clears errors from the error div underneath the board
 */
function clearErrors() {
    $('#errortext').html("");
}

function main() {
    init();
}

main();