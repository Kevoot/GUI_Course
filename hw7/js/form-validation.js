/**
 *	File: https://kevoot.github.io/GUI_Course/hw6/js/form-validation.js
 *	Assignment 7: jQuery Validatilon
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 11/26/2018 7:56PM
 *  Description: This file contains the functions for each validator field. Each one
 *  is handled separately for now as I ran out of time, and would have liked one validator
 *  function which handled all cases but this works.
 * 
 *  This file: Contains all custom validation functions
 */

$.validator.addMethod("firstStart", function () {
    let firstStart = $('#firstStart').val();
    let firstEnd = $('#firstEnd').val();
    if (firstStart > firstEnd || firstStart === "") {
        return false;
    }
    else return true;
});

$.validator.addMethod("firstEnd", function () {
    let firstStart = $('#firstStart').val();
    let firstEnd = $('#firstEnd').val();
    if (firstStart > firstEnd || firstEnd === "") {
        return false;
    }
    else return true;
});

$.validator.addMethod("secondStart", function () {
    let secondStart = $('#secondStart').val();
    let secondEnd = $('#secondEnd').val();
    if (secondStart > secondEnd || secondStart === "") {
        return false;
    }
    else return true;
});

$.validator.addMethod("secondEnd", function () {
    let secondStart = $('#secondStart').val();
    let secondEnd = $('#secondEnd').val();
    if (secondStart > secondEnd || secondEnd === "") {
        return false;
    }
    else return true;
});