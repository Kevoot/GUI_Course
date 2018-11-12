/**
 *	File: https://kevoot.github.io/GUI_Course/hw6/js/main.js
 *	Assignment 6: Creating an Interactive Table
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 11/12/2018 6:25PM
 *  Description: This page gives the user input elements to enter in
 *      values for the start and end of two number ranges, x and y.
 *      x and y are used to dynamically (programmatically) generate
 *      a multiplication table styled with css. It has error handling
 *      in the form of a validation function checkValues(). If the
 *      input has and errors such as range too large, or the range 
 *      values being flip-flopped, a popup modal will appear which
 *      will describe and where to find the errors.
 * 
 *  This file: The file contains the javascript functions for 
 *      validating the user input, and either informing the user
 *      of errors or generating the table
 */

let rows = 0;
let columns = 0;

// Object containing all possible errors found with input
const errorTypes = {
    invalidNum: "Invalid number entered for ",
    lessThanOne: " must be greater than 0!",
    endLessThanStart: " can't be smaller than ",
    rangeTooLarge_1: 'Range between ',
    rangeTooLarge_2: ' can\'t be larger than 20'
}

/**
 * When input button is clicked, check values and then generate table (or show error modal if necessary)
 */
$(document).on("click", "#submitButton", () =>  {
    // Clear the current table contents
    const multTable = document.getElementById("multTable");
    multTable.innerHTML = "";

    // Get all input data
    const r1 = parseInt(document.getElementById("firstStart").value);
    const r2 = parseInt(document.getElementById("firstEnd").value);
    const c1 = parseInt(document.getElementById("secondStart").value);
    const c2 = parseInt(document.getElementById("secondEnd").value);

    // Find errors if present
    const rowErrors = (checkValues({val: r1, loc: "row start"}, {val: r2, loc: "row end"}));
    const columnErrors = (checkValues({val: c1, loc: "column start" }, {val: c2, loc: "column end"}));
    const errors = rowErrors.concat(columnErrors);

    // Check if there are any input errors and show them (don't generate table if errors are present.)
    if(errors.length > 0) {
        const errorStr = errors.join("<br />");
        showErrorMessages(errorStr);
        return;
    }

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
    for(let col = c1; col <= c2; col++) {
        let th = document.createElement("th");
        tableHeadRowEl.appendChild(th);
        th.setAttribute("scope", "col");
        th.appendChild(document.createTextNode("" + col));
    }

    // Create the body which each row will be inserted into
    const tableBodyEl = document.createElement("tbody");

    multTable.appendChild(tableBodyEl);

    for(let row = r1; row <= r2; row++) {
        // Create the row heads
        let tr = document.createElement("tr");
        tableBodyEl.appendChild(tr);

        let th = document.createElement("th");
        tr.appendChild(th);
        th.appendChild(document.createTextNode(row));
        th.setAttribute("scope", "row");

        // We only want the head of each row to be styled, not the entire row
        if(row % 2 !== 0) {
            tr.classList.add('oddrow');
        }

        // Populate each cell in the row with the multiplication value
        for(let col = c1; col <= c2; col++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            td.appendChild(document.createTextNode("" + row * col));
        }
    }
});

/**
 * Checks input to ensure all data is valid, and returns errors 
 * to be shown by modal
 * 
 * @param {*} v1 Starting value
 * @param {*} v2 Ending value
 * @returns {*} Array of error strings
 */
function checkValues(v1, v2) {
    const errors = [];

    // Check for invalid input
    if(isNaN(v1.val) || isNaN(v2.val)) {
        if(isNaN(v1.val)) {
            errors.push(errorTypes.invalidNum + v1.loc);
        }
    
        if(isNaN(v2.val)) {
            errors.push(errorTypes.invalidNum + v2.loc);
        }
        return errors;
    }

    // Range is set to 20, the furthest the two values can be from one another
    if((v2.val - v1.val) > 21) {
        errors.push(errorTypes.rangeTooLarge_1 + v1.loc + ' and ' + v2.loc + errorTypes.rangeTooLarge_2);
    }

    // Check for values less than 1
    if(v1.val < 1) {
        errors.push(v1.loc + errorTypes.lessThanOne);
    }
    if(v2.val < 1 ) {
        errors.push(v2.loc + errorTypes.lessThanOne);
    }

    // Ensure that end number is greater than start number
    if(v1.val > v2.val) {
        errors.push(v2.loc + errorTypes.endLessThanStart + v1.loc);
    }

    return errors;
}

/**
 * This applies the error strings to the modal and opens the modal.
 * 
 * @param {*} errors Array of strings which describe errors found in input
 */
function showErrorMessages(errors) {
    document.getElementById("modalText").innerHTML = "<p>" + errors + "</p>";
    $('#errorModal').modal('show');
}