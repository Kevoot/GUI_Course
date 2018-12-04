/**
 *	File: https://kevoot.github.io/GUI_Course/hw8/js/main.js
 *	Assignment 8: jQuery UI plugin
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 12/04/2018 6:41PM
 *  Description: This page is a continuation of homework 7. The main modifications 
 *  were done to the validation initialization and the creation of the sliders/tabs. 
 *  generateTable() was modified to pull the values from the sliders instead of
 *  text inputs. focusout methods were used to update the text boxes when the sliders
 *  are changed.
 * 
 *  This file: The file contains the javascript functions for generating the table
 *  & intializing the validators/sliders
 */

// Current counter of tabs
let numTabs = 1;

// If we're using multidelete mode or not
let deleteMode = false;

/**
 * If the fields successfully pass validation, this is called to create the table
 * This was updated for homework 8 to accept an id as a parameter and replace that 
 * element with the generated table
 */
function generateTable(targetId) {
    let element = document.getElementById(targetId);

    // Get all input data
    const r1 = parseInt($("#rowRangeSlider").slider("values", 0));
    const r2 = parseInt($("#rowRangeSlider").slider("values", 1));
    const c1 = parseInt($("#columnRangeSlider").slider("values", 0));
    const c2 = parseInt($("#columnRangeSlider").slider("values", 1));

    // Create the initial header row
    const tableHeadEl = document.createElement("thead");
    element.appendChild(tableHeadEl);
    const tableHeadRowEl = document.createElement("tr");
    tableHeadEl.appendChild(tableHeadRowEl);

    // Set top-left column head
    const topLeft = document.createElement("th");
    tableHeadRowEl.appendChild(topLeft);
    topLeft.setAttribute("scope", "col");
    topLeft.appendChild(document.createTextNode("x"));

    // Create the column heads
    for (let col = c1; col <= c2; col++) {
        let th = document.createElement("th");
        tableHeadRowEl.appendChild(th);
        th.setAttribute("scope", "col");
        th.appendChild(document.createTextNode("" + col));
    }

    // Create the body which each row will be inserted into
    const tableBodyEl = document.createElement("tbody");

    element.appendChild(tableBodyEl);

    for (let row = r1; row <= r2; row++) {
        // Create the row heads
        let tr = document.createElement("tr");
        tableBodyEl.appendChild(tr);

        let th = document.createElement("th");
        tr.appendChild(th);
        th.appendChild(document.createTextNode(row));
        th.setAttribute("scope", "row");

        // We only want the head of each row to be styled, not the entire row
        if (row % 2 !== 0) {
            tr.classList.add('oddrow');
        }

        // Populate each cell in the row with the multiplication value
        for (let col = c1; col <= c2; col++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            td.appendChild(document.createTextNode("" + row * col));
        }
    }
}

// This is so that the input tab table is always visible and updating
function updateTable() {
    // Clear the current table contents
    resetTable();

    let resultTable = generateTable("multTable");
}

// Clears the div out entirely.
function resetTable() {
    const multTable = document.getElementById("multTable");
    multTable.innerHTML = "";
}

/*
 * Shortcut for $(document).ready function, this function intializes the sliders and
 * sets their ranges and start values.
 */
$(function () {
    $("#rowRangeSlider").slider({
        range: true,
        min: 1,
        max: 100,
        values: [1, 20],
        slide: function (event, ui) {
            $("#rowRange").val(ui.values[0] + " - " + ui.values[1]);
            if ($('#inputForm').validate().element('#rowRange')) {
                updateTable();
            }
            else {
                resetTable();
            }
        }
    });
    $("#rowRange").val($("#rowRangeSlider").slider("values", 0) +
        " - " + $("#rowRangeSlider").slider("values", 1));

    $("#columnRangeSlider").slider({
        range: true,
        min: 1,
        max: 100,
        values: [1, 20],
        slide: function (event, ui) {
            $("#columnRange").val(ui.values[0] + " - " + ui.values[1]);
            if ($('#inputForm').validate().element('#columnRange')) {
                updateTable();
            }
            else {
                resetTable();
            }
        }
    });
    $("#columnRange").val($("#columnRangeSlider").slider("values", 0) +
        " - " + $("#columnRangeSlider").slider("values", 1));

    /**
     * These two functions ensure the slider handles update if the text is updated
     */
    $("#rowRange").focusout(() => {
        let text = $("#rowRange").val();
        let splitArr = text.split("-");
        for (let i in splitArr) {
            splitArr[i] = splitArr[i].replace(/\s/g, '');
            $('#rowRangeSlider').slider("values", i, splitArr[i]);
        }
    });
    $("#columnRange").focusout(() => {
        let text = $("#columnRange").val();
        let splitArr = text.split("-");
        for (let i in splitArr) {
            splitArr[i] = splitArr[i].replace(/\s/g, '');
            $('#columnRangeSlider').slider("values", i, splitArr[i]);
        }
    });

    // Initialize the tabs
    $("#tabs").tabs();
});

/**
 * Generate a new tab and use the generateTable function to fill the body
 * of the new div
 */
$(document).on("click", "#submitButton", () => {
    numTabs++;

    const r1 = parseInt($("#rowRangeSlider").slider("values", 0));
    const r2 = parseInt($("#rowRangeSlider").slider("values", 1));
    const c1 = parseInt($("#columnRangeSlider").slider("values", 0));
    const c2 = parseInt($("#columnRangeSlider").slider("values", 1));

    let titleString = r1 + "-" + r2 + "x" + c1 + "-" + c2;

    // Create a new tab with a close button available
    $("div#tabs ul").append(
        "<li id='tab" + numTabs + "li'><a class='datatab' href='#tab" + numTabs + "'>" + titleString + 
            "</a><a href='#tab" + numTabs + 
            "close'><i class='fas fa-times-circle datatab-close'></i></a>" +
            "</li>"
    );

    $("div#tabs").append(
        "<div id='tab" + numTabs + "'>" + titleString + "</div>"
    );

    // Force refresh of the tabs
    $("div#tabs").tabs("refresh");

    let tableParentDiv = document.createElement("div");
    tableParentDiv.setAttribute("id", 'tableParent' + numTabs);
    tableParentDiv.setAttribute("class", "table-responsive");

    let tableDiv = document.createElement("div");
    tableDiv.setAttribute("id", 'table' + numTabs);
    tableDiv.setAttribute("class", 'table table-dark table-hover');

    tableParentDiv.append(tableDiv);

    // To ensure the theme matched properly, force the class and other
    // miscellaneous attributes onto the created element to ensure
    // functionality with jQuery ui
    let tabDiv = document.createElement("div");
    tabDiv.setAttribute("id", 'tab' + numTabs);
    tabDiv.setAttribute("aria-labelledby", "ui-id-" + (numTabs + 1));
    tabDiv.setAttribute('role', "tabpanel");
    tabDiv.setAttribute('class', "ui-tabs-panel ui-corner-bottom ui-widget-content");
    tabDiv.setAttribute('aria-hidden', "false");
    tabDiv.append(tableParentDiv);


    document.getElementById("tab" + numTabs).append(tabDiv);

    $('#btnDiv')[0].style.display = "block";

    // Generate the table into the target div
    generateTable('table' + numTabs);
});

// On click, closes the tab and resets UI to input tab
$(document).on('click', '.datatab-close', (evt) => {
    numTabs--;
    let removalTab = evt.currentTarget.parentElement.parentElement;
    $(removalTab).remove();
    // Force refresh of the tabs after deletion
    $("div#tabs").tabs("refresh");
    if (numTabs <= 1) {
        $('#btnDiv')[0].style.display = "none";
    }
});

// Toggles between allowing the user to delete multiple tabs at 
// once and resetting the UI to the previous state.
$(document).on('click', '#deleteButton', () => {
    if (deleteMode) {
        // If we're in delete mode, get all checkboxes, and delete the
        // parent tab if the checkbox is checked
        let checkboxes = $('.form-check-lg');
        for (let i = 0; i < checkboxes.length; i++) {
            if(checkboxes[i].checked) {
                $(checkboxes[i].parentElement).remove();
            }
        }
        $('#deleteButton').attr('class', 'btn btn-primary btn-sm');
        deleteMode = false;
        finishTabDeletion();
    } 
    // Otherwise reset the UI
    else {
        let items = $('div#tabs ul li');
        // We don't want the user to delete the input tab, so start at 1
        for (let i = 1; i < items.length; i++) {
            $(items[i]).prepend(
                '<input type="checkbox" class="form-check-input form-check-lg"  id="check' + 
                numTabs + '"></div>'
            )
        }
        $('#deleteButton').attr('class', 'btn btn-success btn-sm');
        $('#cancelButton')[0].style.display = "";
        deleteMode = true;
    }
});

$(document).on('click', '#cancelButton', () => {
    finishTabDeletion();
})

// Hide the cancel button and remove all checkboxes
function finishTabDeletion() {
    $('#cancelButton')[0].style.display = "none";
    $('.form-check-lg').remove();
}



/**
 * Validation rules and messages
 * errorLabelContainer is specified separately to write into a different div rather than
 * appending to the offending text field.
 */
$("#inputForm").validate({
    /**
     * Set these to false so validation only occurs onsubmission
     */
    onkeyup: false,
    onclick: false,
    /**
     * Custom rules specified in form-validation.js
     */
    rules: {
        rowRange: "rowRange",
        columnRange: "columnRange",
    },
    /**
     * Error messages if validation does not pass.
     */
    messages: {
        rowRange: "Error in Row values: Start value must be less than or equal to End value, and the difference between the two <= 20",
        columnRange: "Error in Column values: Start value must be less than or equal to End value, and the difference between the two <= 20",
    },
    submitHandler: updateTable,
    errorLabelContainer: '#errorContainer'
});