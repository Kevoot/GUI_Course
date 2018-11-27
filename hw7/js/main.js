/**
 *	File: https://kevoot.github.io/GUI_Course/hw6/js/main.js
 *	Assignment 7: jQuery Validatilon
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 11/26/2018 7:56PM
 *  Description: This page is a continuation of homework 6. In the previous
 *  homework, I created a custom modal to inform the user when an error was 
 *  found with the input. This version instead uses the jQuery validator 
 *  plugin to check the validity of all the fields before allowing submission
 * 
 *  This file: The file contains the javascript functions for generating the table
 */

let rows = 0;
let columns = 0;

/**
 * If the fields successfully pass validation, this is called to create the table
 */
function generateTable() {
    // Clear the current table contents
    const multTable = document.getElementById("multTable");
    multTable.innerHTML = "";

    // Get all input data
    const r1 = parseInt(document.getElementById("firstStart").value);
    const r2 = parseInt(document.getElementById("firstEnd").value);
    const c1 = parseInt(document.getElementById("secondStart").value);
    const c2 = parseInt(document.getElementById("secondEnd").value);

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
    onfocusout: false,
    /**
     * Custom rules specified in form-validation.js
     */
    rules: {
        firstStart: "firstStart",
        firstEnd: "firstEnd",
        secondStart: "secondStart",
        secondEnd: "secondEnd"
    },
    /**
     * Error messages if validation does not pass.
     */
    messages: {
        firstStart: "Error in Row Start: Number must be > 0, smaller than Row End, and the difference between the two <= 20",
        firstEnd: "Error in Row End: Number must be > 0, larger than Row Start, and the difference between the two <= 20",
        secondStart: "Error in Column Start: Number must be > 0, smaller than Column End, and the difference between the two <= 20",
        secondEnd: "Error in Column End: Number must be > 0, larger than Column Start, and the difference between the two <= 20",
    },
    submitHandler: generateTable,
    errorLabelContainer: '#errorContainer'
});