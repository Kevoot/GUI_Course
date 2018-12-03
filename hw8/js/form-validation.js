/**
 *	File: https://kevoot.github.io/GUI_Course/hw8/js/form-validation.js
 *	Assignment 8: jQuery UI plugin
 *	Name: Kevin Holmes
 *	Email: kevin_holmes@student.uml.edu
 * 	Status: CS Undergrad
 *	Last Modified: 11/29/2018 8:59PM
 *  Description: This file was modified to use sliders instead of the two
 *  text input sections as used in homework 6 & 7. The validations ensure
 *  that the distance between the two is no larger than 20 and the start
 *  is smaller than the end.
 * 
 *  This file: Contains all custom validation functions
 */

$.validator.addMethod("rowRange", function () {
    let rowStart = $( "#rowRangeSlider" ).slider( "values", 0 );
    let rowEnd = $( "#rowRangeSlider" ).slider( "values", 1 )
    if (rowStart > rowEnd || (rowEnd - rowStart) > 20) {
        return false;
    }
    else return true;
});

$.validator.addMethod("columnRange", function () {
    let columnStart = $( "#columnRangeSlider" ).slider( "values", 0 );
    let columnEnd = $( "#columnRangeSlider" ).slider( "values", 1 )
    if (columnStart > columnEnd || (columnEnd - columnStart) > 20) {
        return false;
    }
    else return true;
});