/**
 *	File: https://kevoot.github.io/GUI_Course/hw8/js/main.js
 *	Assignment 8: jQuery UI plugin
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 11/29/2018 8:59PM
 *  Description: This page is a continuation of homework 7. The main modifications 
 *  were done to the validation initialization and the creation of the sliders. 
 *  generateTable() was modified to pull the values from the sliders instead of
 *  text inputs.
 * 
 *  This file: The file contains the javascript functions for generating the table
 *  & intializing the validators/sliders
 */

/**
 * If the fields successfully pass validation, this is called to create the table
 */
function generateTable() {
    // Clear the current table contents
    resetTable();

    // Get all input data
    const r1 = parseInt($("#rowRangeSlider").slider("values", 0));
    const r2 = parseInt($("#rowRangeSlider").slider("values", 1));
    const c1 = parseInt($("#columnRangeSlider").slider("values", 0));
    const c2 = parseInt($("#columnRangeSlider").slider("values", 1));

    // Create the initial header row
    const tableHeadEl = document.createElement("thead");
    multTable.appendChild(tableHeadEl);
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

    multTable.appendChild(tableBodyEl);

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
                generateTable();
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
                generateTable();
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


});

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
    submitHandler: generateTable,
    errorLabelContainer: '#errorContainer'
});